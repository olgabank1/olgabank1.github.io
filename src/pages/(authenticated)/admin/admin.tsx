import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCaption, TableDataCell, TableHead, TableHeaderCell, TableRow, TableRowExpandable } from "@sb1/ffe-tables-react";
import { LoaderFunction, redirect } from "react-router-dom";
import { meQuery } from "../../../queries/me";
import { transactionsThatneedApprovalPlzQuery } from "../../../queries/transactions";


const AdminPage = () => {
    const { data: me } = useSuspenseQuery(meQuery);
    const {data: data}  = useSuspenseQuery(transactionsThatneedApprovalPlzQuery(me!));

    const navnHeader = "Navn";
    const epostHeader = "Epost";
    const hvaGjelederHeader = "Hva gjelder det?";
    console.log(data)

    
    return (
    <div>
        <h1>Admin Page</h1>
        <Table>
        <TableCaption>Tabel utvidbare rader</TableCaption>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell scope="col">
                            {navnHeader}
                        </TableHeaderCell>
                        <TableHeaderCell scope="col">
                            {epostHeader}
                        </TableHeaderCell>
                        <TableHeaderCell scope="col">
                            {hvaGjelederHeader}
                        </TableHeaderCell>
                    </TableRow>
                </TableHead>
        <TableBody>
                    {data.map((it, index) => (
                        <TableRowExpandable
                            isDefaultOpen={index === 1}
                            key={it.users?.name}
                            expandContent={"les mer om personen her!"}
                        >
                            <TableDataCell columnHeader={navnHeader}>
                                {it.users?.name}
                            </TableDataCell>
                            <TableDataCell columnHeader={epostHeader}>
                                {it.users?.nnin}
                            </TableDataCell>
                            <TableDataCell columnHeader={hvaGjelederHeader}>
                                {"Godkjenning av transaksjon"}
                            </TableDataCell>
                            <TableDataCell columnHeader={epostHeader}>
                                {it.account_transactions.timestamp.setFullYear(it.account_transactions.timestamp.getFullYear() + 1)}
                            </TableDataCell>
                        </TableRowExpandable>
                    ))}
                </TableBody>

        </Table>
    </div>)
}


AdminPage.loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const me = await queryClient.ensureQueryData(meQuery);

    if(me?.role === "Advisor") {
        return null
    };
    if (me) {
      return redirect("/nettbank-privat");
    }
    return null;
  };


export default AdminPage