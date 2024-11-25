import React, { useState, useEffect, useMemo } from 'react';
import { Plus, DollarSign, FileText, Sun, Moon, LayoutDashboard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const FinancialDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [salaries, setSalaries] = useState(new Array(12).fill(0));
  const [expenses, setExpenses] = useState(Array(12).fill().map(() => []));
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeView, setActiveView] = useState('dashboard');
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [newSalary, setNewSalary] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const financialStats = useMemo(() => {
    const totalSalaries = salaries.reduce((sum, salary) => sum + salary, 0);
    const totalExpenses = expenses.reduce((sum, monthExpenses) => 
      sum + monthExpenses.reduce((mSum, expense) => mSum + expense.amount, 0), 0
    );
    return {
      totalSalaries,
      totalExpenses,
      balance: totalSalaries - totalExpenses
    };
  }, [salaries, expenses]);

  const monthlyData = useMemo(() => 
    months.map((month, index) => ({
      name: month,
      expenses: expenses[index].reduce((sum, expense) => sum + expense.amount, 0),
      salary: salaries[index],
      balance: salaries[index] - expenses[index].reduce((sum, expense) => sum + expense.amount, 0)
    })), [expenses, salaries]);

  const expenseCategories = useMemo(() => {
    const categories = {};
    expenses.forEach(monthExpenses => {
      monthExpenses.forEach(expense => {
        categories[expense.name] = (categories[expense.name] || 0) + expense.amount;
      });
    });sya
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) {
      showAlert('Preencha todos os campos', 'error');
      return;
    }
    const updatedExpenses = [...expenses];
    updatedExpenses[selectedMonth] = [
      ...updatedExpenses[selectedMonth],
      { name: newExpense.name, amount: parseFloat(newExpense.amount) }
    ];
    setExpenses(updatedExpenses);
    setNewExpense({ name: '', amount: '' });
    showAlert('Despesa adicionada com sucesso');
  };

  const handleAddSalary = () => {
    if (!newSalary) {
      showAlert('Digite um valor válido', 'error');
      return;
    }
    const updatedSalaries = [...salaries];
    updatedSalaries[selectedMonth] = parseFloat(newSalary);
    setSalaries(updatedSalaries);
    setNewSalary('');
    showAlert('Salário registrado com sucesso');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="text-lg mb-2">Salário Total</CardTitle>
            <div className="text-2xl font-bold text-green-600">
              R$ {financialStats.totalSalaries.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="text-lg mb-2">Despesas Totais</CardTitle>
            <div className="text-2xl font-bold text-red-600">
              R$ {financialStats.totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="text-lg mb-2">Saldo</CardTitle>
            <div className="text-2xl font-bold text-blue-600">
              R$ {financialStats.balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Análise Mensal</CardTitle>
            <div className="w-full overflow-x-auto">
              <BarChart width={500} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="salary" fill="#82ca9d" name="Salário" />
                <Bar dataKey="expenses" fill="#8884d8" name="Despesas" />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Despesas por Categoria</CardTitle>
            <div className="w-full overflow-x-auto">
              <PieChart width={500} height={300}>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Tendência de Saldo</CardTitle>
            <div className="w-full overflow-x-auto">
              <LineChart width={500} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Saldo" />
              </LineChart>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 bg-white">
          <CardContent className="p-6">
            <CardTitle className="mb-4">Registro de Movimentações</CardTitle>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  className="flex-1"
                  placeholder="Nome da despesa"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                />
                <Input
                  className="flex-1"
                  type="number"
                  placeholder="Valor"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
                <Button onClick={handleAddExpense}>Adicionar Despesa</Button>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  className="flex-1"
                  type="number"
                  placeholder="Valor do salário"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                />
                <Button onClick={handleAddSalary}>Registrar Salário</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMonthlyView = () => (
    <div className="space-y-4">
      <Card className="dark:bg-gray-800 bg-white">
        <CardContent className="p-6">
          <CardTitle className="mb-4">Detalhes do Mês: {months[selectedMonth]}</CardTitle>
          <div className="space-y-2">
            <p className="text-lg">Salário: R$ {salaries[selectedMonth].toFixed(2)}</p>
            <p className="text-lg">Total Despesas: R$ {expenses[selectedMonth].reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Lista de Despesas</h3>
            <div className="space-y-2">
              {expenses[selectedMonth].map((expense, index) => (
                <div key={index} className="flex justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  <span>{expense.name}</span>
                  <span>R$ {expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Sistema de Gestão Financeira</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="dark:bg-gray-800"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-40 dark:bg-gray-800">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setActiveView(activeView === 'dashboard' ? 'monthly' : 'dashboard')}
              className="dark:bg-gray-800"
            >
              {activeView === 'dashboard' ? 'Visão Mensal' : 'Dashboard'}
            </Button>
          </div>
        </div>

        {alert.show && (
          <Alert className={`mb-4 ${alert.type === 'error' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {activeView === 'dashboard' ? renderDashboard() : renderMonthlyView()}
      </div>
    </div>
  );
};

export default FinancialDashboard;
