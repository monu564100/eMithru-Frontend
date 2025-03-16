import React, { useState } from "react";
import axios from "axios";
import { Container, Tab, Box, Tabs, TextField, Button, Typography, Alert } from "@mui/material";
import useTabs from "../../hooks/useTabs";
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";

export default function Academic() {
  const { currentTab, onChangeTab } = useTabs("Academic Details");

  // State for form data
  const [academicData, setAcademicData] = useState({
    sslc: {
      school: "",
      percentage: "",
      yearOfPassing: "",
      schoolAddress: "",
      board: "",
    },
    puc: {
      college: "",
      percentage: "",
      yearOfPassing: "",
      collegeAddress: "",
      board: "",
    },
  });

  // State for success/error messages
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (section, field, value) => {
    setAcademicData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [field]: value },
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/academics", academicData);
      setMessage("Academic details submitted successfully!");
      setError(null);
    } catch (err) {
      setError("Failed to submit data. Please try again.");
      setMessage(null);
    }
  };

  return (
    <Page title="Student Profile">
      <Container maxWidth="lg">
        <Tabs allowScrollButtonsMobile variant="scrollable" scrollButtons="auto" value={currentTab} onChange={onChangeTab}>
          <Tab
            disableRipple
            key="Academic Details"
            label="Academic Details"
            icon={<Iconify icon={"ic:round-account-box"} width={20} height={20} />}
            value="Academic Details"
          />
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {currentTab === "Academic Details" && (
          <Box>
            <Typography variant="h6" gutterBottom>Enter Academic Details</Typography>

            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              {/* SSLC Fields */}
              <Typography variant="subtitle1">SSLC Details</Typography>
              <TextField label="School Name" fullWidth margin="normal" value={academicData.sslc.school} onChange={(e) => handleChange("sslc", "school", e.target.value)} required />
              <TextField label="Percentage" fullWidth margin="normal" type="number" value={academicData.sslc.percentage} onChange={(e) => handleChange("sslc", "percentage", e.target.value)} required />
              <TextField label="Year of Passing" fullWidth margin="normal" type="number" value={academicData.sslc.yearOfPassing} onChange={(e) => handleChange("sslc", "yearOfPassing", e.target.value)} required />
              <TextField label="School Address" fullWidth margin="normal" value={academicData.sslc.schoolAddress} onChange={(e) => handleChange("sslc", "schoolAddress", e.target.value)} required />
              <TextField label="Board" fullWidth margin="normal" value={academicData.sslc.board} onChange={(e) => handleChange("sslc", "board", e.target.value)} required />

              {/* PUC Fields */}
              <Typography variant="subtitle1" sx={{ mt: 3 }}>PUC Details</Typography>
              <TextField label="College Name" fullWidth margin="normal" value={academicData.puc.college} onChange={(e) => handleChange("puc", "college", e.target.value)} required />
              <TextField label="Percentage" fullWidth margin="normal" type="number" value={academicData.puc.percentage} onChange={(e) => handleChange("puc", "percentage", e.target.value)} required />
              <TextField label="Year of Passing" fullWidth margin="normal" type="number" value={academicData.puc.yearOfPassing} onChange={(e) => handleChange("puc", "yearOfPassing", e.target.value)} required />
              <TextField label="College Address" fullWidth margin="normal" value={academicData.puc.collegeAddress} onChange={(e) => handleChange("puc", "collegeAddress", e.target.value)} required />
              <TextField label="Board" fullWidth margin="normal" value={academicData.puc.board} onChange={(e) => handleChange("puc", "board", e.target.value)} required />

              <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>Submit</Button>
            </form>
          </Box>
        )}
      </Container>
    </Page>
  );
}
