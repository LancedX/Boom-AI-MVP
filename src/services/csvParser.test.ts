import { describe, it, expect } from 'vitest';
import { parseStudentCSV } from './csvParser';
import { INITIAL_STUDENT_ROWS } from './rawCsvData';
import Papa from 'papaparse';

describe('CSV Parser and Ingest Service', () => {
  it('successfully parses all 50 student records from the supplied CSV format', () => {
    // Generate valid CSV string from the raw student rows
    const csvString = Papa.unparse(INITIAL_STUDENT_ROWS);
    const result = parseStudentCSV(csvString);

    expect(result.valid).toBe(true);
    expect(result.rowCount).toBe(50);
    expect(result.data.length).toBe(50);

    // Verify first row mapping
    const first = result.data[0];
    expect(first.student_id).toBeDefined();
    expect(first.first_name).toBeDefined();
    expect(first.riskScore).toBeGreaterThanOrEqual(0);
    expect(['High', 'Medium', 'Watch']).toContain(first.riskTier);
  });

  it('handles invalid or empty rows without crashing', () => {
    const invalidCsv = 'invalid_header_1,invalid_header_2\nval1,val2\n';
    const result = parseStudentCSV(invalidCsv);

    expect(result.data.length).toBe(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
