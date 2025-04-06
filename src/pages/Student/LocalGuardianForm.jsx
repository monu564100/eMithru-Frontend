import React, { useState, useEffect, useCallback, useContext } from "react";
import { useSnackbar } from "notistack";

// form
import { useForm } from "react-hook-form";

// @mui
import { Box, Grid, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import {
  FormProvider,
  RHFTextField,
} from "../../components/hook-form";

// context
import { AuthContext } from "../../context/AuthContext";

// axios instance
import api from "../../utils/axios";

const DEFAULT_VALUES = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  relationWithGuardian: "",
  mobileNumber: "",
  phoneNumber: "",
  residenceAddress: "",
  taluka: "",
  village: "",
  district: "", // ✅ important
  state: "",    // ✅ important
  pincode: "",
};

export default function LocalGuardianForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const [localGuardianExists, setLocalGuardianExists] = useState(false);

  // Fetch Local Guardian Details
  const fetchLocalGuardianDetails = useCallback(async () => {
    try {
      const userId = user?._id;
      if (!userId) {
        console.error("User ID missing");
        return;
      }
  
      const response = await api.get(`/v1/local-guardians`);
      const guardians = response.data?.data?.localGuardians || [];
  
      // Find guardian matching current userId
      const guardianDetails = guardians.find(g => g.userId === userId);
  
      if (guardianDetails) {
        Object.keys(DEFAULT_VALUES).forEach((key) => {
          if (guardianDetails[key] !== undefined) {
            setValue(key, guardianDetails[key]);
          }
        });
        setLocalGuardianExists(true);
      } else {
        console.log("No Local Guardian found for user");
      }
    } catch (error) {
      console.error("Failed to fetch Local Guardian details:", error);
      enqueueSnackbar("Failed to fetch Local Guardian details", { variant: "error" });
    }
  }, [setValue, enqueueSnackbar, user]);
  

  useEffect(() => {
    fetchLocalGuardianDetails();
  }, [fetchLocalGuardianDetails]);

  // Submit Form
  const onSubmit = async (data) => {
    try {
      const userId = user?._id;
      if (!userId) return;
  
      const payload = { ...data, userId };
  
      if (localGuardianExists) {
        // Update existing
        await api.put(`/v1/local-guardians/${userId}`, payload);
        enqueueSnackbar("Local Guardian updated successfully!", { variant: "success" });
      } else {
        // Create new
        await api.post(`/v1/local-guardians`, payload);
        enqueueSnackbar("Local Guardian created successfully!", { variant: "success" });
        setLocalGuardianExists(true);
      }
    } catch (error) {
      console.error("Error submitting Local Guardian form:", error);
      enqueueSnackbar("Failed to submit Local Guardian details", { variant: "error" });
    }
  };
  

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <RHFTextField name="firstName" label="First Name" required />
              </Grid>

              <Grid item xs={12} sm={4}>
                <RHFTextField name="middleName" label="Middle Name" />
              </Grid>

              <Grid item xs={12} sm={4}>
                <RHFTextField name="lastName" label="Last Name" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="email" label="Email" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="relationWithGuardian" label="Relation with Guardian" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="mobileNumber" label="Mobile Number" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="phoneNumber" label="Phone Number" />
              </Grid>

              <Grid item xs={12}>
                <RHFTextField name="residenceAddress" label="Residence Address" required />
              </Grid>

              <Grid item xs={12} sm={4}>
                <RHFTextField name="taluka" label="Taluka" />
              </Grid>

              <Grid item xs={12} sm={4}>
                <RHFTextField name="village" label="Village" />
              </Grid>

              <Grid item xs={12} sm={4}>
                <RHFTextField name="district" label="District" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="state" label="State" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="pincode" label="Pincode" />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {localGuardianExists ? "Update" : "Save"}
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
