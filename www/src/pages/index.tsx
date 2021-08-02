/* eslint-disable react/no-unescaped-entities */
import MainContainer from "~/components/container/Main";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/svg+xml",
  });

  console.log(acceptedFiles);

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <MainContainer
      title="Welcome to SVG Component Generator"
      description="a place where you can convert any .svg files into react or react-native components"
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </MainContainer>
  );
}
