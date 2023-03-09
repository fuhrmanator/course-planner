import { TextEncoder } from 'text-encoding-utf-8';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
