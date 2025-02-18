import { useState } from 'react'
import { Friend, Expense } from '@/types'
import { ExpenseList } from '@/components/ExpenseList'
import { AddExpenseForm } from '@/components/AddExpenseForm'
import { BalanceSummary } from '@/components/BalanceSummary'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function App() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ])

  const [expenses, setExpenses] = useState<Expense[]>([])

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Split Bills</h1>
          <p className="text-gray-600">Track expenses and settle up with friends</p>
        </header>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <main>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add New Expense</SheetTitle>
                    <SheetDescription>
                      Enter the expense details and split amount
                    </SheetDescription>
                  </SheetHeader>
                  <AddExpenseForm friends={friends} onAddExpense={addExpense} />
                </SheetContent>
              </Sheet>
            </div>
            <ExpenseList expenses={expenses} friends={friends} />
          </main>

          <aside>
            <BalanceSummary expenses={expenses} friends={friends} />
          </aside>
        </div>
      </div>
    </div>
  )
}