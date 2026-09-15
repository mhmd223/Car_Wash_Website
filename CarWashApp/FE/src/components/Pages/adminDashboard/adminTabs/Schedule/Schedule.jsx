// Admin schedule import workflow: parse, preview, validate through the API, and save.
import { useRef, useState } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { useSchedule } from "../../../../../hooks/useSchedule";
import classes from "./schedule.module.css";

const MAX_SCHEDULE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_SCHEDULE_EXTENSIONS = ["xlsx", "csv"];

function normalizeTimeValue(value) {
  if (typeof value === "number" && value >= 0 && value < 1) {
    const totalMinutes = Math.round(value * 24 * 60) % (24 * 60);
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  if (value instanceof Date) {
    return `${String(value.getHours()).padStart(2, "0")}:${String(
      value.getMinutes(),
    ).padStart(2, "0")}`;
  }

  return value;
}

// Spreadsheet parsing is isolated here and loaded only for admin uploads,
// keeping the initial bundle smaller for regular users.
async function parseScheduleFile(file, extension) {
  if (extension === "csv") {
    const csvText = await file.text();
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      throw new Error("Invalid CSV file");
    }

    return result.data;
  }

  const { default: readXlsxFile } = await import("read-excel-file/browser");
  const rows = await readXlsxFile(file);
  const headers = (rows[0] || []).map(String);

  return rows.slice(1).map((values) => {
    const parsedRow = {};
    headers.forEach((header, index) => {
      parsedRow[header] = values[index] ?? "";
    });
    return parsedRow;
  });
}

export default function Schedule() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const { uploadScheduleMutation, clearScheduleMutation } = useSchedule();

  const resetState = () => {
    setFileName("");
    setRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveSchedule = async () => {
    try {
      await uploadScheduleMutation.mutateAsync(rows);
      toast.success("Schedule saved successfully.");
    } catch (error) {
      toast.error("Couldn't save the schedule.");
    }
  };

  const handleClearSchedule = async () => {
    try {
      await clearScheduleMutation.mutateAsync();
      resetState();
      toast.success("Schedule cleared successfully.");
    } catch (error) {
      toast.error("Couldn't clear the schedule.");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (
      file.size > MAX_SCHEDULE_FILE_SIZE ||
      !ALLOWED_SCHEDULE_EXTENSIONS.includes(extension)
    ) {
      toast.error("Choose an XLSX or CSV file smaller than 5 MB.");
      resetState();
      return;
    }

    setIsParsing(true);
    try {
      const parsedRows = (await parseScheduleFile(file, extension)).map(
        (row) => ({
          ...row,
          OpenTime: normalizeTimeValue(row.OpenTime),
          CloseTime: normalizeTimeValue(row.CloseTime),
        }),
      );

      if (!parsedRows.length) {
        toast.error("The selected sheet doesn't contain any rows.");
        resetState();
        return;
      }

      setFileName(file.name);
      setRows(parsedRows);
      toast.success(`Loaded ${parsedRows.length} row(s) from ${file.name}.`);
    } catch (error) {
      toast.error(
        "Couldn't read that file. Please upload a valid XLSX or CSV file.",
      );
      resetState();
    } finally {
      setIsParsing(false);
    }
  };

  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <p className={classes.eyebrow}>Operations</p>
        <h2 className={classes.title}>Open days schedule</h2>
        <p className={classes.subtitle}>
          Upload an Excel file with the open days schedule to preview it below.
        </p>
      </div>

      <div className={classes.uploadRow}>
        <label className={classes.uploadButton} htmlFor="scheduleFile">
          {isParsing ? "Reading file..." : "Choose Excel file"}
        </label>
        <input
          id="scheduleFile"
          ref={fileInputRef}
          className={classes.fileInput}
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          disabled={isParsing}
        />
        {fileName && <span className={classes.fileName}>{fileName}</span>}
        {fileName && (
          <button
            type="button"
            className={classes.clearButton}
            onClick={handleClearSchedule}
            disabled={clearScheduleMutation.isPending}
          >
            Clear
          </button>
        )}
      </div>

      {rows.length > 0 && (
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column}>{String(row[column])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!rows.length && !isParsing && (
        <p className={classes.message}>No schedule uploaded yet.</p>
      )}
      {rows.length && !isParsing && (
        <button
          type="button"
          className={classes.saveSchedule}
          onClick={handleSaveSchedule}
          disabled={uploadScheduleMutation.isPending}
        >
          {uploadScheduleMutation.isPending ? "Saving..." : "Open schedule"}
        </button>
      )}
    </div>
  );
}
