'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  IconLayoutColumns,
  IconChevronDown,
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { CreditTransaction } from '@/features/credits/types';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

function typeBadgeVariant(type: CreditTransaction['type']): BadgeVariant {
  switch (type) {
    case 'purchase':
    case 'topup':
      return 'default';
    case 'spend':
      return 'destructive';
    case 'refund':
    case 'adjustment':
      return 'outline';
    default:
      return 'secondary';
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const columns: ColumnDef<CreditTransaction>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant={typeBadgeVariant(row.original.type)} className="capitalize">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.description ?? '—'}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'amount',
    header: () => <div className="w-full text-right">Amount</div>,
    cell: ({ row }) => (
      <div
        className={cn(
          'text-right font-medium tabular-nums',
          row.original.amount >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-500 dark:text-red-400',
        )}
      >
        {row.original.amount >= 0 ? '+' : ''}
        {row.original.amount.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="w-full text-right">Date</div>,
    cell: ({ row }) => (
      <div className="text-right text-muted-foreground">{formatDate(row.original.createdAt)}</div>
    ),
  },
];

export function TransactionHistory({ transactions }: { transactions: CreditTransaction[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Transaction History</CardTitle>
        <CardDescription>Your recent credit activity</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <IconLayoutColumns data-icon="inline-start" />
              Columns
              <IconChevronDown data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-hidden border-y">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-4">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
            items={[10, 20, 30, 50].map((n) => ({ label: `${n}`, value: `${n}` }))}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {[10, 20, 30, 50].map((n) => (
                  <SelectItem key={n} value={`${n}`}>
                    {n}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {Math.max(table.getPageCount(), 1)}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
