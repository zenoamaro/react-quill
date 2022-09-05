import Quill from 'quill';

import ReactQuill from './core';

if (!ReactQuill.Quill) {
    ReactQuill.Quill = Quill;
}

export = ReactQuill;
