import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import { Alert } from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      setIsError(false);
      setIsSuccess(false);
    }
  };

  const removeFile = () => {
    setFile(undefined);
    setIsError(false);
    setIsSuccess(false);
  };

  const uploadFile = async () => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setIsError(true);
      setErrorMessage("Only CSV files are allowed");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Uploading file to", url);

      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      console.log("File to upload:", file.name);
      console.log("Uploading to:", response.data.signedUrl);

      const uploadResult = await fetch(response.data.signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "text/csv",
        },
      });

      if (!uploadResult.ok) {
        throw new Error(`Upload failed with status: ${uploadResult.status}`);
      }

      console.log("Upload successful!");
      setIsSuccess(true);
      setFile(undefined);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsError(true);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          File successfully uploaded and queued for processing!
        </Alert>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage || "An error occurred during upload"}
        </Alert>
      )}

      {!file ? (
        <Button
          component="label"
          role={undefined}
          color="primary"
          variant="outlined"
          tabIndex={-1}
          startIcon={<CloudUpload />}
        >
          Upload file
          <input type="file" accept=".csv" hidden onChange={onFileChange} />
        </Button>
      ) : (
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">{file.name}</Typography>
          <Button
            onClick={removeFile}
            disabled={isLoading}
            variant="contained"
            size="small"
            color="error"
            startIcon={<Close />}
          >
            Remove file
          </Button>
          <Button
            onClick={uploadFile}
            disabled={isLoading}
            variant="contained"
            size="small"
          >
            {isLoading ? (
              <>
                <CircularProgress size={14} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Upload file"
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
}
