#!/usr/bin/env python3
"""
Servidor HTTP para Diet Tracker
Sirve archivos estáticos y hace proxy a la API Next.js
"""
import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
from http import HTTPStatus

PORT = 8085
API_HOST = "http://100.126.164.101:3002"

class DietHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    
    def do_GET(self):
        if self.path.startswith('/diet/api/'):
            self.proxy_request()
        else:
            self.serve_static()
    
    def do_POST(self):
        if self.path.startswith('/diet/api/'):
            self.proxy_request()
        else:
            self.serve_static()
    
    def do_DELETE(self):
        if self.path.startswith('/diet/api/'):
            self.proxy_request()
        else:
            self.send_error(404, "File not found")
    
    def do_PUT(self):
        if self.path.startswith('/diet/api/'):
            self.proxy_request()
        else:
            self.send_error(404, "File not found")
    
    def proxy_request(self):
        """Proxy para API Diet Tracker"""
        try:
            api_path = self.path.replace('/diet/api', '/api')
            target_url = f"{API_HOST}{api_path}"
            
            print(f"[PROXY] {self.command} {self.path} -> {target_url}")
            
            # Leer body si existe
            content_length = int(self.headers.get('Content-Length', 0))
            data = self.rfile.read(content_length) if content_length > 0 else None
            
            # Headers para forward
            headers = {}
            for key, value in self.headers.items():
                if key.lower() not in ['host', 'connection', 'content-length']:
                    headers[key] = value
            
            req = urllib.request.Request(
                target_url,
                data=data,
                headers=headers,
                method=self.command
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    self.send_response(response.status)
                    
                    # Headers
                    for header, value in response.headers.items():
                        if header.lower() not in ['transfer-encoding']:
                            self.send_header(header, value)
                    
                    self.end_headers()
                    
                    # Body
                    self.wfile.write(response.read())
                    
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                self.end_headers()
                self.wfile.write(str(e.read()).encode())
            except Exception as e:
                self.send_error(500, f"Proxy error: {e}")
                
        except Exception as e:
            print(f"[ERROR] Proxy failed: {e}")
            self.send_error(500, f"Internal server error: {e}")
    
    def serve_static(self):
        """Proxy todo al servidor Next.js (modo standalone)"""
        # Next.js en modo standalone no genera HTML estático
        # Todo debe ser servido por el servidor Next.js
        path = self.path
        
        # Mapear rutas /diet/ -> /
        if path.startswith('/diet/'):
            next_path = path[5:]  # Remover /diet/
            if next_path == '' or next_path == '/':
                next_path = '/'
        elif path == '/':
            next_path = '/'
        else:
            next_path = path
        
        # Hacer proxy al servidor Next.js
        target_url = f"{API_HOST}{next_path}"
        
        print(f"[PROXY] GET {self.path} -> {target_url}")
        
        try:
            req = urllib.request.Request(target_url)
            
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                
                for header, value in response.headers.items():
                    if header.lower() not in ['transfer-encoding']:
                        self.send_header(header, value)
                
                self.end_headers()
                self.wfile.write(response.read())
                
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.end_headers()
        except Exception as e:
            print(f"[ERROR] Proxy failed: {e}")
            self.send_error(500, f"Proxy error: {e}")
    
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Permitir reutilización del puerto inmediatamente
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), DietHTTPRequestHandler) as httpd:
        print(f"=== DIET TRACKER SERVER ===")
        print(f"Listening: http://100.126.164.101:{PORT}")
        print(f"URL: http://100.126.164.101:{PORT}/diet/")
        print(f"API Proxy: {API_HOST}/api")
        print(f"Serving from: {os.getcwd()}")
        print("Press Ctrl+C to stop")
        print("=" * 40)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
