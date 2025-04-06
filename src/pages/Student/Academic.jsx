import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import { Box, Grid, Card, Stack, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../components/hook-form";

const DEFAULT_VALUES = {
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
  localEntry: {
    college: "",
    percentage: "",
    yearOfPassing: "",
    collegeAddress: "",
    board: "",
  },
};

export default function PrevAcademic() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({ defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;

  const fetchAcademicDetails = useCallback(async () => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) {
        console.log("No user ID available");
        return;
      }

      console.log(`Fetching academic details for user: ${userId}`); // Debug log

      const response = await api.get(`/v1/academics/${userId}`);
      console.log("API Response:", response.data); // Debug log

      const data = response.data.data?.academicDetails;

      if (data) {
        console.log("Setting form values with data:", data); // Debug log
        Object.keys(DEFAULT_VALUES).forEach(section => {
          Object.keys(DEFAULT_VALUES[section]).forEach(field => {
            setValue(`${section}.${field}`, data[section]?.[field] || "");
          });
        });
      }
    } catch (error) {
      console.error("Error fetching academic details:", error); // Debug log
      if (error.response?.status !== 404) {
        enqueueSnackbar("Error fetching academic details", { variant: "error" });
      }
    } finally {
      setIsDataFetched(true);
    }
  }, [user?._id, menteeId, setValue, enqueueSnackbar]);

  useEffect(() => {
    console.log("Component mounted or dependencies changed"); // Debug log
    fetchAcademicDetails();
  }, [fetchAcademicDetails]);

  const onSubmit = useCallback(async (formData) => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) {
        enqueueSnackbar("User not authenticated", { variant: "error" });
        return;
      }

      console.log("Submitting form data:", formData); // Debug log

      const response = await api.post("/v1/academics", { ...formData, userId });
      console.log("Submission response:", response.data); // Debug log

      enqueueSnackbar("Academic details saved successfully!", { variant: "success" });
    } catch (error) {
      console.error("Submission error:", error); // Debug log
      enqueueSnackbar(error.response?.data?.message || "Error saving academic details", { 
        variant: "error" 
      });
    }
  }, [menteeId, user?._id, enqueueSnackbar]);

  const handleReset = () => {
    console.log("Resetting form"); // Debug log
    reset(DEFAULT_VALUES);
  };

  if (!isDataFetched) {
    console.log("Rendering loading state"); // Debug log
    return <div>Loading...</div>;
  }

  console.log("Rendering form"); // Debug log

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* SSLC Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>SSLC Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="sslc.school" label="School Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="sslc.percentage" label="Percentage" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="sslc.yearOfPassing" label="Year of Passing" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="sslc.schoolAddress" label="School Address" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="sslc.board" label="Board" fullWidth />
              </Grid>
            </Grid>
          </Card>
        </Grid>
=======
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
>>>>>>> 810776484a687e0abb01c0853120c4c6fe0b5fc7

        {/* PUC Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>PUC Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="puc.college" label="College Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="puc.percentage" label="Percentage" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="puc.yearOfPassing" label="Year of Passing" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="puc.collegeAddress" label="College Address" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="puc.board" label="Board" fullWidth />
              </Grid>
            </Grid>
          </Card>
        </Grid>

<<<<<<< HEAD
        {/* Local Entry Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Diploma / Local Entry Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="localEntry.college" label="College Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="localEntry.percentage" label="Percentage" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="localEntry.yearOfPassing" label="Year of Passing" type="number" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="localEntry.collegeAddress" label="College Address" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="localEntry.board" label="Board" fullWidth />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSubmitting}
              >
                Save Academic Details
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
=======
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
>>>>>>> 810776484a687e0abb01c0853120c4c6fe0b5fc7
