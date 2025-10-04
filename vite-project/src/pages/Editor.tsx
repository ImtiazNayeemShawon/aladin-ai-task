import { useSearchParams } from "react-router-dom";
import { connectToSandbox, createPreview } from '@codesandbox/sdk/browser';
import { useEffect, useState, useRef } from "react";
import api from "../lib/api";

export default function Editor() {
  const [searchParams] = useSearchParams();
  const sandboxId = searchParams.get("sandboxId") || "4jyr6m";
  const [initialSessionFromServer, setInitialSessionFromServer] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const editorUrl = `https://codesandbox.io/p/sandbox/4jyr6m?embed=1`;
  const previewUrl = `https://${sandboxId}.csb.app/`;

  //  initial session
  useEffect(() => {
    api.get(`/sessions/${sandboxId}`).then((res) => {
      setInitialSessionFromServer(res.data.session);
    });
  }, [sandboxId]);

  // Connect to sandbox after session is loaded
  useEffect(() => {
    if (!initialSessionFromServer) return;

    const connect = async () => {
      const sandboxClient = await connectToSandbox({
        session: initialSessionFromServer,
        getSession: (id) => api.get(`/sessions/${id}`),
        onFocusChange: (notify) => {
          const onVisibilityChange = () => {
            notify(document.visibilityState === 'visible');
          };

          document.addEventListener('visibilitychange', onVisibilityChange);

          return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
          };
        }
      });

      setClient(sandboxClient);
    };

    connect();

  }, [initialSessionFromServer]);

  // Create preview 
  useEffect(() => {
    if (client) {
      const previewInstance = createPreview(client.hosts.getUrl(5173));
      setPreview(previewInstance);
      if (previewInstance.iframe) {
        previewInstance.iframe.style.width = "100%";
        previewInstance.iframe.style.height = "100%";
        previewInstance.iframe.style.border = "none";
        previewInstance.iframe.style.display = "block";
      }
      console.log("previewInstance", previewInstance)
    }
  }, [client]);

  // Attach the iframe 
  useEffect(() => {
    if (preview && preview.iframe && previewContainerRef.current) {
      previewContainerRef.current.innerHTML = "";
      previewContainerRef.current.appendChild(preview.iframe);
    }
  }, [preview]);

  return (
    <div className="grid grid-cols-2 h-screen ">
      <div className="flex flex-col justify-center items-center">
        <iframe src={editorUrl}
          style={{width: "100%", height: "500px", border: "0", borderRadius: "4px", overflow: "hidden"}}
          title="New Sandbox"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
        <p className="m-5">if you found any issue on this embedded editor, please check this external link <a href={editorUrl} className="text-blue-500 underline">{editorUrl}</a></p>
      </div>
      <div
        className=" h-full w-full p-0 m-0 relative"
        ref={previewContainerRef}
        style={{
          height: "100%",
          width: "100%",
          padding: 0,
          margin: 0,
          overflow: "hidden",
          position: "relative",
        }}
      />
    </div>
  );
}