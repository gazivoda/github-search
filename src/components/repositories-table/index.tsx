import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import React, { useState } from "react";
import { Repository } from "../github-search-container";

function descendingComparator<T>(a: T, b: T, orderBy: any) {
    if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
        return -1;
    }
    if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
): (
        a: { [key in Key]: string },
        b: { [key in Key]: string }
    ) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: any, comparator: (a: T, b: T) => number) {
    array?.sort((a, b) => {
        const order = comparator(a, b);
        if (order !== 0) return order;
        return a - b;
    });
    return array?.map(el => el);
}

interface HeadCell {
    id: keyof Repository;
    label: string;
}

const headCells: HeadCell[] = [
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
    { id: "url", label: "Url" }
];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Repository
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof Repository) => (
        event: React.MouseEvent<unknown>
    ) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={"left"}
                        padding={"default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead >
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%"
        },
        paper: {
            width: "100%",
            marginBottom: theme.spacing(2)
        },
        table: {
            minWidth: 750
        },
        visuallyHidden: {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            top: 20,
            width: 1
        }
    })
);

const RepositoriesTable = (props: { data: Repository[] }) => {
    const classes = useStyles();
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Repository>('name');

    const handleRequestSort = () => {
        const isAsc = orderBy === 'name' && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy('name');
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={"medium"}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={null}
                            onRequestSort={handleRequestSort}
                            rowCount={props?.data?.length || 0}
                        />
                        <TableBody>
                            {stableSort(props.data, getComparator(order, orderBy))?.map(
                                (row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.name}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                align="left"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="left"><small>{row.description}</small></TableCell>
                                            <TableCell align="left"><a href={`${row.url}`} target="_blank">Link to repo</a></TableCell>
                                        </TableRow>
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default RepositoriesTable;
