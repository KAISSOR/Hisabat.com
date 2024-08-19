import React, { useContext, useState } from "react"
import axios from 'axios'

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const tokenoo = localStorage.getItem("token");

    //calculate incomes
    const addIncome = async ( income) => {

        const updatedIncome = {
            ...income,
            type: "income"
        };
    
        await axios.post(`http://localhost:5000/income/add-income`, updatedIncome , {
            headers: {
                'auth-company': tokenoo ,
              },
        })
            .catch((err) => {
                setError(err.response.data.message)
            });
    
        getIncomes();
    }; 
    const getIncomes = async () => {
        const response = await axios.get(`http://localhost:5000/income/get-income`, {
            headers: {
                'auth-company':tokenoo 
                     },
        })
        setIncomes(response.data)
        console.log(response.data)
    };  
    const deleteIncome = async (id) => {
        await axios.delete(`http://localhost:5000/income/delete-income/${id}`, {
            headers: {
                'auth-company':tokenoo
                    },
        })
        getIncomes()
    };
    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    };

    //calculate incomes
    const addExpense = async (income) => {

        const updatedIncome = {
            ...income,
            type: "expense"
        };
    
        await axios.post(`http://localhost:5000/expense/add-expense`, updatedIncome , {
            headers: {
                'auth-company': tokenoo
               },
        })
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    };
    const getExpenses = async () => {
        const response = await axios.get(`http://localhost:5000/expense/get-expense`, {
            headers: {
                'auth-company': tokenoo
                 },
        })
        setExpenses(response.data)
    };
    const deleteExpense = async (id) => {

        await axios.delete(`http://localhost:5000/expense/delete-expense/${id}` , {
            headers: {
                'auth-company': tokenoo      },
        })
        getExpenses()
    };
    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    };
    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    };
    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}