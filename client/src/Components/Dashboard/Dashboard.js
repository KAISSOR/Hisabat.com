import { React , useEffect , useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';
import styles from './styles.module.css'
import jsPDF from 'jspdf';
import axios from 'axios';
import Swal from 'sweetalert2';

function Dashboard() {
    const {totalExpenses,incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()
    const [incomess, setIncomess] = useState([]);
    const [expensess, setExpensess] = useState([]);
    const tokenoo = localStorage.getItem("token");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    const getExpensess = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/expense/get-expense`, {
                headers: { 'auth-company': tokenoo },
            })
            setExpensess(response.data)
            } catch (error) {console.error(error);}
        };
    const getIncomess = async () => {
            try {
              const response = await axios.get(`http://localhost:5000/income/get-income`, {
                headers: { 'auth-company': tokenoo },
            })
            setIncomess(response.data)
            } catch (error) {console.error(error);}
        };

    getIncomes();
    getExpenses();
    getIncomess();
    getExpensess();
    }, [tokenoo ]);
  
    const generatePDFexpense = () => {
        const doc = new jsPDF();
        doc.setFont('Helvetica'); 
        doc.setFontSize(30); 
        doc.setTextColor('#444444'); 
        doc.text('( Expenses )', 74 , 14);
        doc.setFontSize(10); 
        doc.text('_________________________________________________________________________________________________', 10 , 20 );
        doc.setFontSize(18); 
        expensess.forEach((expense, index) => {
            doc.text(`Expense ${index + 1} : ${expense.title } || ${expense.amount} || ${expense.createdAt}`, 10, 30 + (index * 10) , { encoding: 'unicode' });
        });
            doc.save('expenses.pdf');
            Swal.fire({
                icon: 'success',
                title: 'تم التحميل!',
                text: 'تم تحميل ملف الـ PDF بنجاح.'
            });
    };
    const generatePDFincome = () => {
        const doc = new jsPDF();
        doc.setFont('Helvetica'); 
        doc.setFontSize(30); 
        doc.setTextColor('#444444'); 
        doc.text('( Incomes )', 77 , 14);
        doc.setFontSize(10); 
        doc.text('_________________________________________________________________________________________________', 10 , 20 );
        doc.setFontSize(18); 

        incomess.forEach((income, index) => {
            doc.text(`Income ${index + 1} : ${income.title } || ${income.amount} || ${income.createdAt}`, 10, 30 + (index * 10) , { encoding: 'unicode' });
        });
            doc.save('incomes.pdf');
            Swal.fire({
                icon: 'success',
                title: 'The income PDF is now being downloaded.',
                text: 'The PDF file has been uploaded successfully.'
            });
    };
    const DeleteExpense = async () => {
        const result = await Swal.fire({
          title: 'warning!',
          text: 'Are you sure you want to delete all data?' ,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete' ,
          cancelButtonText: 'Cancel'
        });
    
        if (result.isConfirmed) {
            setIsDeleting(true);
    
        try {
            await axios.delete('http://localhost:5000/expense/delete-all-expenses' , {
            headers: {
                'auth-company': tokenoo      },
            });
            Swal.fire('Deleted!', 'All data has been deleted successfully.', 'success');
            getIncomes();
            getExpenses();
        } catch (error) {
            console.error(error);
            Swal.fire('mistake!', 'An error occurred during the deletion process.', 'error');
          } finally {
            setIsDeleting(false);
          }
        }
    
    };
    const DeleteIncome = async () => {
        const result = await Swal.fire({
          title: 'warning!',
          text: 'Are you sure you want to delete all data?' ,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete' ,
          cancelButtonText: 'Cancel'
        });
    
        if (result.isConfirmed) {
          setIsLoading(true);
    
        try {
            await axios.delete('http://localhost:5000/income/delete-all-incomes', {
            headers: {
                'auth-company': tokenoo      },
            });
            Swal.fire('Deleted!', 'All data has been deleted successfully.', 'success');
            getIncomes();
            getExpenses();          
        } catch (error) {
            console.error(error);
            Swal.fire('mistake!', 'An error occurred during the deletion process.', 'error');
          } finally {
            setIsLoading(false);
          }
        }
    };

    return (
<DashboardStyled>
    <InnerLayout>
        <h1>All Transactions</h1>
        <div className="stats-con">
            <div className="chart-con">
                <Chart />
                <div className="amount-con">
                    <div className="income">
                        <h2>Total Income</h2>
                        <p>
                         {totalIncome()}
                        </p>
                    </div>
                    <div className="expense">
                        <h2>Total Expense</h2>
                        <p>
                         {totalExpenses()}
                        </p>
                    </div>
                    <div className="balance">
                        <h2>Total Balance</h2>
                        <p>
                         {totalBalance()}
                        </p>
                    </div>
                </div>
            </div>
            <div className="history-con">
                <History />
                <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                <div className="salary-item">
                    <p>
                        {Math.min(...incomes.map(item => item.amount))}
                    </p>
                    <p>
                        {Math.max(...incomes.map(item => item.amount))}
                    </p>
                </div>
                <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                <div className="salary-item">
                    <p>
                        {Math.min(...expenses.map(item => item.amount))}
                    </p>
                    <p>
                        {Math.max(...expenses.map(item => item.amount))}
                    </p>
                </div>
                <br></br>
                <hr></hr>
                <h2 className="salary-title"> <span>Get Expenses</span> <span>Get Incomes</span> </h2>
                <h2 className="salary-title">
                <button className={styles.white_btn} onClick={generatePDFexpense}>Expense PDF</button> 
                <button className={styles.white_btn} onClick={generatePDFincome}>Incomes PDF</button>
                </h2>
                <hr></hr>    
                <br></br>                 
                <h2 className="salary-title">
                <button className={styles.green_btn} disabled={isDeleting} onClick={DeleteExpense}> {isDeleting ? 'Deleting...' : 'Delete All expenses '} </button> 
                <button className={styles.green_btn} disabled={isLoading}  onClick={DeleteIncome}>  {isLoading  ? 'Deleting...' : 'Delete All incomes '} </button>
                </h2>
            </div>
        </div>
    </InnerLayout>
</DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .stats-con{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
        .chart-con{
            grid-column: 1 / 4;
            height: 400px;
            .amount-con{
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 2rem;
                .income, .expense{
                    grid-column: span 2;
                }
                .income, .expense, .balance{
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;
                    p{
                        font-size: 3.5rem;
                        font-weight: 700;
                    }
                }

                .balance{
                    grid-column: 2 / 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    p{
                        color: var(--color-green);
                        opacity: 0.6;
                        font-size: 4.5rem;
                    }
                }
            }
        }

        .history-con{
            grid-column: 4 / -1;
            h2{
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .salary-title{
                font-size: 1.2rem;
                span{
                    font-size: 1.8rem;
                }
            }
            .salary-item{
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p{
                    font-weight: 600;
                    font-size: 1.6rem;
                }
            }
        }
    }
`;

export default Dashboard