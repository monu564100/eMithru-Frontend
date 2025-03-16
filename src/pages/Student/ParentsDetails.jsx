import React, { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import api from "../../utils/axios";

// MUI Components
import { Box, Grid, Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Custom Form Components
import { FormProvider, RHFTextField } from "../../components/hook-form";

// Default Form Values
const DEFAULT_VALUES = {
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherLastName: "",
  fatherOccupation: "",
  motherOccupation: "",
  fatherOrganization: "",
  motherOrganization: "",
  fatherDesignation: "",
  motherDesignation: "",
  fatherOfficeAddress: "",
  motherOfficeAddress: "",
  fatherAnnualIncome: "",
  motherAnnualIncome: "",
  fatherOfficePhone: "",
  motherOfficePhone: "",
  fatherResidencePhone: "",
  motherResidencePhone: "",
  fatherEmail: "",
  motherEmail: "",
  mobileNumber: "",
  residenceAddress: "",
  fax: "",
  district: "",
  taluka: "",
  village: "",
  state: "",
  pincode: "",
};

export default function ParentsDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({ defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    const fetchParentDetails = async () => {
      try {
        const response = await api.get("/v1/parent-details");
        if (response.data) {
          reset(response.data);
        }
      } catch (error) {
        enqueueSnackbar("Failed to fetch parent details", { variant: "error" });
      }
    };
    fetchParentDetails();
  }, [reset, enqueueSnackbar]);

  const onSubmit = useCallback(async (formData) => {
    try {
      await api.post("/v1/parent-details", formData, {
        headers: { "Content-Type": "application/json" },
      });
      enqueueSnackbar("Form submitted successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "An error occurred while processing the request",
        { variant: "error" }
      );
    }
  }, [enqueueSnackbar]);

  return (
    <FormProvider methods={methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Father's Details */}
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="fatherFirstName" label="Father's First Name" fullWidth required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="fatherMiddleName" label="Father's Middle Name" fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="fatherLastName" label="Father's Last Name" fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="motherFirstName" label="Mother's First Name" fullWidth required />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="motherMiddleName" label="Mother's Middle Name" fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFTextField name="motherLastName" label="Mother's Last Name" fullWidth />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Father's Details Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <h3>Father's Details</h3>
                <RHFTextField name="fatherOccupation" label="Father's Occupation" fullWidth required />
                <RHFTextField name="fatherOrganization" label="Father's Organization" fullWidth />
                <RHFTextField name="fatherDesignation" label="Father's Designation" fullWidth />
                <RHFTextField name="fatherOfficePhone" label="Father's Office Phone No." fullWidth required />
                <RHFTextField name="fatherOfficeAddress" label="Father's Office Address" fullWidth />
                <RHFTextField name="fatherAnnualIncome" label="Father's Annual Income" fullWidth />
              </Stack>
            </Card>
          </Grid>

          {/* Mother's Details Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <h3>Mother's Details</h3>
                <RHFTextField name="motherOccupation" label="Mother's Occupation" fullWidth required />
                <RHFTextField name="motherOrganization" label="Mother's Organization" fullWidth />
                <RHFTextField name="motherDesignation" label="Mother's Designation" fullWidth />
                <RHFTextField name="motherOfficePhone" label="Mother's Phone No." fullWidth required />
                <RHFTextField name="motherOfficeAddress" label="Mother's Office Address" fullWidth />
                <RHFTextField name="motherAnnualIncome" label="Mother's Annual Income" fullWidth />
              </Stack>
            </Card>
          </Grid>

          {/* Submit and Reset Buttons */}
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-end">
                <Box display="flex" gap={1}>
                  <LoadingButton variant="outlined" onClick={() => reset(DEFAULT_VALUES)}>Reset</LoadingButton>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>Save</LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
