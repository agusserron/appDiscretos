import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const containsXSS = (obj) => {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        const value = obj[prop];
        if (typeof value === 'string') {
          const cleanValue = DOMPurify.sanitize(value);
          if (value !== cleanValue) {
            return true; 
          }
        }
      }
    }
    return false; 
}

export default {
    containsXSS
}
