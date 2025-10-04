import { SandpackFileExplorer } from 'sandpack-file-explorer';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackConsole,
} from '@codesandbox/sandpack-react';

const Clientversion = () => {
  return (
    <SandpackProvider template="react" theme={"dark"}>
      <SandpackLayout style={{ height: "100vh" }}>
        <SandpackFileExplorer style={{ height: "100vh" }} />
        <SandpackCodeEditor style={{ height: "100vh" }} />
        <SandpackPreview style={{ height: "100vh" }} />
      </SandpackLayout>

      {/* Console output area */}
      <div style={{ height: "30vh", backgroundColor: "#111" }}>
        <SandpackConsole
          showHeader
          
          showRestartButton
          style={{ height: "100%", color: "white" }}
        />
      </div>
    </SandpackProvider>
  );
};

export default Clientversion;
