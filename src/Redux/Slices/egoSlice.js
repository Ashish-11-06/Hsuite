import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import egoAPIs from "../API/egoApi";

// Async Thunks
export const addEgogramTest = createAsyncThunk(
  "ego/addEgogramTest",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.AddEgogramTest(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addEgogramCategory = createAsyncThunk(
  "ego/addEgogramCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.AddEgogramCategory(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addEgogramStatement = createAsyncThunk(
  "ego/addEgogramStatement",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.AddEgogramStatement(payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addStatementsToEgogramTest = createAsyncThunk(
  "ego/addStatementsToEgogramTest",
  async (payload, thunkAPI) => {
    try {
      const response = await egoAPIs.AddStatementToTest(payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllEgogramTests = createAsyncThunk(
  "ego/fetchAllEgogramTests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.GetAllTest();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllEgogramCategories = createAsyncThunk(
  "ego/fetchAllEgogramCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.GetAllCategory();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAllEgogramStatements = createAsyncThunk(
  "ego/fetchAllEgogramStatements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.GetAllStatements();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetch20TestsFotTest = createAsyncThunk(
  "ego/fetch20TestsFotTest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.GetTestFor20Tests();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk for fetching statements by test ID
export const fetchStatementsByTestId = createAsyncThunk(
  "ego/fetchStatementsByTestId",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.GetStatementByTestId(testId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching statements");
    }
  }
);


export const fetchStatementsByTestIdToTest = createAsyncThunk(
  "ego/fetchStatementsByTestIdToTest",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.GetStatementByTestIdToTest(testId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching test statements");
    }
  }
);

// Make sure the action matches what you're sending
export const editStatement = createAsyncThunk(
  "ego/editStatement",
  async ({ updatedStatement, statement_id }, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.editStatement(updatedStatement, statement_id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteStatement = createAsyncThunk(
  "ego/deleteStatement",
  async (statement_id, { rejectWithValue }) => {
    try {
      await egoAPIs.deleteStatement(statement_id);
      return statement_id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Thunk to post egogram result
export const postEgogramResult = createAsyncThunk(
  'egogramResult/postEgogramResult',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await egoAPIs.EgogramResult(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for fetching Egogram history
export const fetchEgogramHistory = createAsyncThunk(
  "ego/fetchEgogramHistory",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("User ID is undefined or missing");
    }
    try {
      const response = await egoAPIs.GetEgoTestHistory(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const egoSlice = createSlice({
  name: "ego",
  initialState: {
    loading: false,
    error: null,
    success: null,
    tests: [],
    categories: [],
    statements: [],
    statementsByTest: [],
    statementsByTestToTest: [],
    EgogramHistory: [],
    testsFor20: [],
  },
  reducers: {
    clearEgoState: state => {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
    resetEgogramResult: (state) => {
      state.result = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Add Egogram Test
      .addCase(addEgogramTest.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addEgogramTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Test added successfully";
        state.tests.push(action.payload.test);
      })
      .addCase(addEgogramTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to add test";
      })

      // Add Egogram Category
      .addCase(addEgogramCategory.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addEgogramCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Category added successfully";
        state.categories.push(action.payload.category);
      })
      .addCase(addEgogramCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to add category";
      })

      // Add Egogram Statement
      .addCase(addEgogramStatement.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addEgogramStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Statement added successfully";
        state.statements.push(action.payload.statement);
      })
      .addCase(addEgogramStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to add statement";
      })

      // Add Statements to Egogram Test
      .addCase(addStatementsToEgogramTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addStatementsToEgogramTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Statements added to test successfully";
      })
      .addCase(addStatementsToEgogramTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to add statements to test";
      })

      // Fetch All Egogram Tests
      .addCase(fetchAllEgogramTests.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllEgogramTests.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.tests = action.payload.tests || [];
      })
      .addCase(fetchAllEgogramTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch tests";
      })

      // Fetch All Egogram Categories
      .addCase(fetchAllEgogramCategories.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllEgogramCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const categories = action.payload.categories;
        state.statementCategories = categories.reduce((acc, cat) => {
          acc[cat.id] = cat.category;
          return acc;
        }, {});
        state.categories = categories;
      })
      .addCase(fetchAllEgogramCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch categories";
      })

      // Fetch All Egogram Statements
      .addCase(fetchAllEgogramStatements.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchAllEgogramStatements.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.statements = action.payload.statements || [];
      })
      .addCase(fetchAllEgogramStatements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch statements";
      })

      // Fetch Statements by Test ID
      .addCase(fetchStatementsByTestId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchStatementsByTestId.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.statementsByTest = action.payload;
      })
      .addCase(fetchStatementsByTestId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch test statements";
      })

      // Fetch Statements by Test ID for Test
      .addCase(fetchStatementsByTestIdToTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchStatementsByTestIdToTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.statementsByTestToTest = action.payload.statements;
      })
      .addCase(fetchStatementsByTestIdToTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch test statements";
      })      

      // Edit Statement
      .addCase(editStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(editStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Statement updated successfully";
        const updated = action.payload;
        const statements = state.statementsByTest?.statements;
        if (statements) {
          const index = statements.findIndex((s) => s.id === updated.id);
          if (index !== -1) {
            statements[index] = { ...statements[index], ...updated };
          }
        }
      })
      .addCase(editStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to update statement";
      })

      // Delete Statement
      .addCase(deleteStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteStatement.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Statement deleted successfully";
        state.statementsByTest.statements = state.statementsByTest.statements.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to delete statement";
      })

      // Post Egogram Result
      .addCase(postEgogramResult.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(postEgogramResult.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Result saved successfully";
        state.result = action.payload;
      })
      .addCase(postEgogramResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to save result";
      })

      // Fetch Egogram History
      .addCase(fetchEgogramHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchEgogramHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.EgogramHistory = action.payload || [];
      })
      .addCase(fetchEgogramHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch history";
      })

      // Fetch 20 Tests for Test
      .addCase(fetch20TestsFotTest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetch20TestsFotTest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.testsFor20 = action.payload || [];
      })
      .addCase(fetch20TestsFotTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to fetch tests";
      });
  },
});

export const { clearEgoState, resetEgogramResult } = egoSlice.actions;

export default egoSlice.reducer;