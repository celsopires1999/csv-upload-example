import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [file, setFile] = useState<File>();
  const [array, setArray] = useState(Array<{}>);

  const fileReader = new FileReader();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const csvFileToArray = (value: string) => {
    const csvHeader = value
      .slice(0, value.indexOf("\n"))
      .replace(/(\r\n|\n|\r)/gm, "")
      .split(",");
    const csvRows = value.slice(value.indexOf("\n") + 1).split("\n");

    const array: Array<{}> = csvRows.map((i) => {
      const values = i.replace(/(\r\n|\n|\r)/gm, "").split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {} as { [key: string]: string });
      return obj;
    });
    setArray(array);
  };

  const handleOnSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event: ProgressEvent<FileReader>) {
        const text = event.target?.result;
        if (typeof text == "string") {
          console.log(text);
          csvFileToArray(text);
        }
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <h1>React.JS CSV Import Example </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />
        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
      <br />
      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item: { [key: string]: string }, index) => (
            <tr key={index}>
              {Object.values(item).map((val: string, index) => (
                <td key={index}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
