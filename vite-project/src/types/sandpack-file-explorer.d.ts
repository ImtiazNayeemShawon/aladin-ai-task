declare module 'sandpack-file-explorer' {
  import { ComponentType } from 'react';

  interface SandpackFileExplorerProps {
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
  }

  export const SandpackFileExplorer: ComponentType<SandpackFileExplorerProps>;
}
