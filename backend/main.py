from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import yt_dlp
import os

app = FastAPI()



# CORS setup to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Directory where temporary videos will be saved on the server
VIDEO_DIR = "temp_videos"

# Ensure the temporary download directory exists
if not os.path.exists(VIDEO_DIR):
    os.makedirs(VIDEO_DIR)

@app.get("/download_video")
async def download_video(url: str):
    try:
        ydl_opts_info = {
            'quiet': True,
            'format': 'best',  
        }

        with yt_dlp.YoutubeDL(ydl_opts_info) as ydl:
            info = ydl.extract_info(url, download=False)  # Do not download, just fetch info
            video_title = info.get("title", "video").replace(" ", "_").replace("/", "_")  # Sanitize title
            video_title += ".mp4"

        
        video_path = os.path.join(VIDEO_DIR, video_title)

        ydl_opts_download = {
            'format': 'best',
            'quiet': True,
            'outtmpl': video_path,  
        }

        with yt_dlp.YoutubeDL(ydl_opts_download) as ydl:
            ydl.download([url])

                # Check if the file exists before sending
        if not os.path.isfile(video_path):
            raise FileNotFoundError(f"Video file {video_title} not found after download.")


        # Return the file as a downloadable response
        return FileResponse(video_path, media_type="video/mp4", filename=video_title)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading video: {str(e)}")
