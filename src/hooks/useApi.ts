import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authAPI,
  transactionsAPI,
  budgetsAPI,
  analysisAPI,
} from "@/services/api";

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const response = await authAPI.login(credentials);
        return response;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      try {
        const response = await authAPI.register(data);
        return response;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
  });
};

// Transaction hooks
export const useTransactions = (params?: {
  startDate?: string;
  endDate?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionsAPI.getAll(params),
    enabled: !!localStorage.getItem("authToken"),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      date: string;
      description: string;
      amount: number;
      category: string;
      type: "income" | "expense";
    }) => transactionsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUploadCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => transactionsAPI.uploadCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

// Budget hooks
export const useBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetsAPI.getAll(),
    enabled: !!localStorage.getItem("authToken"),
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { category: string; limit: number; month: string }) =>
      budgetsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      budgetsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useCurrentMonthBudget = () => {
  return useQuery({
    queryKey: ["currentMonthBudget"],
    queryFn: () => budgetsAPI.getCurrentMonth(),
    enabled: !!localStorage.getItem("authToken"),
  });
};

// Analysis hooks
export const useAnalysis = (month?: string) => {
  return useQuery({
    queryKey: ["analysis", month],
    queryFn: () => analysisAPI.getAnalysis(month),
    enabled: !!localStorage.getItem("authToken"),
  });
};

export const useMonthlyAnalysis = (month: string) => {
  return useQuery({
    queryKey: ["monthlyAnalysis", month],
    queryFn: () => analysisAPI.getMonthlyAnalysis(month),
    enabled: !!localStorage.getItem("authToken") && !!month,
  });
};

export const useGenerateAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (month?: string) => analysisAPI.generateNewAnalysis(month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysis"] });
    },
  });
};
