import React from "react";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
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

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
