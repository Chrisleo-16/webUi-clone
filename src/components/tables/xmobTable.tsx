import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

interface Column {
  label: string;
  key: string;
}

interface XmobTableProps {
  columns: Column[];
  data: Record<string, React.ReactNode>[];
  rowsPerPageOptions?: number[]; 
  defaultRowsPerPage?: number; 
}

const XmobTable: React.FC<XmobTableProps> = ({
  columns,
  data,
  rowsPerPageOptions = [5, 10, 15],
  defaultRowsPerPage = 5,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="sm:w-[100%] w-[85vw] overflow-x-auto ">
      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow className="bg-gray-100">
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    minWidth: 100,
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-gray-50 transition">
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      minWidth: 100,
                      whiteSpace: "nowrap",
                      fontSize: { xs: "0.75rem", sm: "0.9rem" },
                    }}
                  >
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default XmobTable;
