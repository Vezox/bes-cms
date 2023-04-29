import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export class UploadAdapter {
    private loader;
    xhr: any;
    constructor(loader: any) {
      this.loader = loader;
    }
  
    upload() {
      return this.loader.file
        .then((file: any) => new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }));
    }
  
    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }
  
    _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();
      xhr.open('POST', import.meta.env.VITE_API_URL + '/api/upload', true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('authorization', 'Bearer ' + cookies.get('token')); // set your token here
    }
  
    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve: any, reject: any, file: any) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;
  
      xhr.addEventListener('error', () => reject(genericErrorText));
      xhr.addEventListener('abort', () => reject());
      xhr.addEventListener('load', () => {
        const response = xhr.response;
       
        if (!response || response.error) {
          return reject(response && response.error ? response.error.message : genericErrorText);
        }
  
        resolve({
          'alt': "test nè",
          urls: {
            default: response.imageURL,
            'alt': "test tiếp nè"
          }
        });
      });
  
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', (evt: any) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }
  
    // Prepares the data and sends the request.
    _sendRequest(file: any) {
      // Prepare the form data.
      const data = new FormData();
  
      data.append('file', file);
      this.xhr.send(data);
    }
  
  }