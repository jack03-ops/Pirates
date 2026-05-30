import mimetypes
import os

def app(environ, start_response):
    path = environ.get('PATH_INFO', '')
    if path == '/':
        path = '/index.html'
    
    base_dir = os.path.join(os.path.dirname(__file__), 'dist')
    file_path = os.path.join(base_dir, path.lstrip('/'))
    
    # Simple routing fallback for SPA
    if not os.path.exists(file_path):
        file_path = os.path.join(base_dir, 'index.html')
        
    if not os.path.exists(file_path):
        start_response('404 Not Found', [('Content-Type', 'text/plain')])
        return [b'404 Not Found - Build dist missing']

    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        mime_type = 'application/octet-stream'
    
    start_response('200 OK', [('Content-Type', mime_type)])
    with open(file_path, 'rb') as f:
        return [f.read()]
