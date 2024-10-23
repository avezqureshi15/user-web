import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";

interface TableRow {
  id: string | number;
}

interface TableProps {
  rows: TableRow[];
  columns: GridColDef[];
}

const TransactionTable = (props: TableProps) => {
  const { rows, columns } = props;

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );

  const handleSelectionModelChange: any = (
    rowSelectionModel: GridRowSelectionModel,
  ) => {
    // const selectedRowData = rows.filter((row) =>
    //   rowSelectionModel.includes(row.id.toString()),
    // );
    setSelectionModel(rowSelectionModel);
  };

  return (
    <div
      style={{
        border: "solid #D9D9D9 1px",
        borderRadius: "10px",
        marginTop: -10,
        paddingLeft: "1rem",
      }}
    >
      {rows && (
        <DataGrid
          sx={{
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: "#FFFFFF",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#F7F8FB",
            },
            "&, [class^=MuiDataGrid]": { border: "none" },
            height: "42vh",
          }}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          disableColumnMenu
          onRowSelectionModelChange={handleSelectionModelChange}
          rowSelectionModel={selectionModel}
        />
      )}
    </div>
  );
};

export default TransactionTable;
