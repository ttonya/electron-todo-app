import React from 'react';

  
const FileUploaderContext = React.createContext({});

export const FileUploaderProvider = FileUploaderContext.Provider;
export const FileUploaderConsumer = FileUploaderContext.Consumer;

export default FileUploaderContext;