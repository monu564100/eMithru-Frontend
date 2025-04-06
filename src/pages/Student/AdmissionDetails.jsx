import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box, Grid, Card, Stack, Typography, FormControl, FormLabel,
  FormGroup, FormControlLabel, Checkbox, Divider
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField, RHFSelect } from "../../components/hook-form";

const admissionSchema = Yup.object().shape({
  admissionYear: Yup.string().required("Admission Year is required"),
  branch: Yup.string().required("Branch is required"),
  semester: Yup.string().required("Semester is required"),
  admissionType: Yup.string().required("Admission Type is required"),
  category: Yup.string().required("Category is required"),
  usn: Yup.string().required("USN is required"),
  collegeId: Yup.string().required("College ID is required"),
});

const DEFAULT_VALUES = {
  admissionYear: "",
  branch: "",
  semester: "",
  admissionType: "",
  category: "",
  usn: "",
  collegeId: "",
  branchChange: {
    year: "",
    branch: "",
    usn: "",
    collegeId: ""
  },
  documentsSubmitted: []
};

export default function AdmissionDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({
    resolver: yupResolver(admissionSchema),
    defaultValues: DEFAULT_VALUES

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../components/hook-form";

export default function AdmissionDetails() {
  const { enqueueSnackbar } = useSnackbar();

  const AdmissionSchema = Yup.object().shape({
    admissionYear: Yup.number().required("Admission Year is required"),
    branch: Yup.string().required("Branch is required"),
    semester: Yup.string().required("Semester is required"),
    admissionType: Yup.string().required("Admission Type is required"),
    category: Yup.string().required("Category is required"),
    usn: Yup.string().required("USN is required"),
    collegeID: Yup.number().required("College ID is required"),
    documentsSubmitted: Yup.array(),
    changeOfBranch: Yup.object().shape({
      year: Yup.number().nullable(),
      newBranch: Yup.string().nullable(),
      usn: Yup.string().nullable(),
      collegeID: Yup.number().nullable(),
    }),
  });

  const defaultValues = {
    admissionYear: "",
    branch: "",
    semester: "",
    admissionType: "",
    category: "",
    usn: "",
    collegeID: "",
    documentsSubmitted: [],
    changeOfBranch: {
      year: "",
      newBranch: "",
      usn: "",
      collegeID: "",
    },
  };

  const methods = useForm({
    resolver: yupResolver(AdmissionSchema),
    defaultValues,
  });

  const { handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = methods;

<<<<<<< HEAD
  const documentsSubmitted = watch("documentsSubmitted");

  const fetchAdmissionDetails = useCallback(async () => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) return;

      const response = await api.get(`/v1/admissions/${userId}`);
      const data = response.data.data?.admissionDetails;

      if (data) {
        Object.keys(DEFAULT_VALUES).forEach(key => {
          if (typeof data[key] === "object" && data[key] !== null) {
            Object.keys(data[key]).forEach(subKey => {
              setValue(`${key}.${subKey}`, data[key][subKey] || "");
            });
          } else {
            setValue(key, data[key] || "");
          }
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        enqueueSnackbar("Error fetching admission details", { variant: "error" });
      }
    } finally {
      setIsDataFetched(true);
    }
  }, [menteeId, user?._id, setValue, enqueueSnackbar]);

  useEffect(() => {
    fetchAdmissionDetails();
  }, [fetchAdmissionDetails]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        userId: menteeId || user?._id, 
      };
  
      const response = await api.post('/v1/admissions', payload);
      enqueueSnackbar('Admission details saved successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error saving admission details:', error);
      enqueueSnackbar('Failed to save admission details.', { variant: 'error' });
    }
  };
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch("v1/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      enqueueSnackbar("Admission details saved!", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Submission failed!", { variant: "error" });
    }
  };

  const documentsList = [
    "SSLC/X Marks Card",
    "PUC/XII Marks Card",
    "Caste Certificate",
    "Migration Certificate",
  ];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Admission Details</Typography>

            <Stack spacing={2}>
              <RHFTextField name="admissionYear" label="Admission Year" />
              <RHFTextField name="branch" label="Branch" />
              <RHFTextField name="semester" label="Semester" />
              <RHFTextField name="admissionType" label="Admission Type" />
              <RHFTextField name="category" label="Category" />
              <RHFTextField name="usn" label="USN" />
              <RHFTextField name="collegeId" label="College ID" />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Details
            </LoadingButton>
            <Typography variant="h5">Admission Details</Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField name="admissionYear" label="Admission Year" />
              <RHFTextField name="branch" label="Branch" />
              <RHFSelect name="semester" label="Semester">
                <option value="" />
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </RHFSelect>
              <RHFSelect name="admissionType" label="Type of Admission">
                <option value="" />
                {["COMEDK", "CET", "MANAGEMENT", "SNQ"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="category" label="Category" />
              <RHFTextField name="usn" label="USN (University Seat Number)" />
              <RHFTextField name="collegeID" label="College ID Number" />
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Change of Branch (if applicable)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                },
              }}
            >
              <RHFTextField name="changeOfBranch.year" label="Year of Change" />
              <RHFTextField name="changeOfBranch.newBranch" label="New Branch" />
              <RHFTextField name="changeOfBranch.usn" label="New USN" />
              <RHFTextField name="changeOfBranch.collegeID" label="New College ID" />
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Documents Submitted
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <FormControl component="fieldset">
              <FormGroup>
                {documentsList.map((doc) => (
                  <FormControlLabel
                    key={doc}
                    control={
                      <Checkbox
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue("documentsSubmitted", (prev) =>
                            checked
                              ? [...prev, doc]
                              : prev.filter((item) => item !== doc)
                          );
                        }}
                      />
                    }
                    label={doc}
                  />
                ))}
              </FormGroup>
            </FormControl>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
