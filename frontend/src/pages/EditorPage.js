import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline'],
  [{ header: [1, 2, 3, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean']
];

const EditorPage = () => {
  const { id: docId } = useParams();
  const wrapperRef = useRef();
  const socketRef = useRef();
  const quillRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    const editorDiv = document.createElement('div');
    wrapperRef.current.append(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS }
    });
    quillRef.current = quill;

    socketRef.current.emit('joinDoc', docId);

    quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socketRef.current.emit('sendChanges', { docId, delta });
    });

    socketRef.current.on('receiveChanges', (delta) => {
      quill.updateContents(delta);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [docId]);

  return <div ref={wrapperRef} style={{ height: '100vh' }}></div>;
};

export default EditorPage;
