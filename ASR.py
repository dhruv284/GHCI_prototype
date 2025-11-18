# record_and_detect_whisper.py
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wavfile
import whisper
import tempfile

SAMPLE_RATE = 16000  # Whisper prefers 16 kHz

def record_seconds(seconds=4, sr=SAMPLE_RATE):
    print(f"Recording {seconds}s... Speak now.")
    audio = sd.rec(int(seconds * sr), samplerate=sr, channels=1, dtype='int16')
    sd.wait()
    audio = audio.flatten()
    return sr, audio

def save_wav(sr, pcm16, path):
    wavfile.write(path, sr, pcm16)

def transcribe_and_detect(audio_path, model_name="small"):
    model = whisper.load_model(model_name)  # tiny, base, small, medium, large
    result = model.transcribe(audio_path, language=None)  # language=None lets Whisper detect it
    # result example: {'text': '...', 'language': 'hi', ...}
    return result

if __name__ == "__main__":
    sr, pcm = record_seconds(4)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        path = f.name
    save_wav(sr, pcm, path)
    res = transcribe_and_detect(path, model_name="small")  # change model for speed/accuracy
    print("Detected language code:", res.get("language"))
    print("Transcribed text:", res.get("text"))
