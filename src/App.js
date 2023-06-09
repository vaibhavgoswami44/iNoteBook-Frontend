import { Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import About from './components/About';
import Alert from './components/Alert';
import { useContext, useEffect } from 'react';
import Login from './components/logs/Login';
import SignUp from './components/logs/SignUp';
import HomePage from './components/HomePage';
import ProfilePage from './components/User/Profile/ProfilePage';
import UserHome from './components/User/UserHome';
import alertContext from './context/alert/AlertContext';
import userContext from './context/user/UserContext';
import ResetPassword from './components/ResetPassword';
import ErrorPage from './components/ErrorPage';
import generalContext from './context/general/generalContext';
import LoadingBar from 'react-top-loading-bar'

function App() {
  const { alertState } = useContext(alertContext)
  const { theme, progress, setProgress } = useContext(generalContext)
  const { iNoteBookUser } = useContext(userContext)

  useEffect(() => {
    // if (theme === 'dark') {
    //   document.body.style.backgroundColor = 'black'
    //   document.body.style.color = 'white'
    // } else {
    //   document.body.style.backgroundColor = 'white'
    //   document.body.style.color = 'black'
    // }
  }, [theme])

  return (
    <>
        <div data-bs-theme={theme}  className={`bg-body-tertiary text-${theme==='dark'?'light':'dark'}-emphasis border`} style={{minHeight:'100vh'}}>
        <LoadingBar
          color='#f11946'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <div>
          <div style={{ position: 'sticky', top: '0', zIndex: '1200' }}>
            <div>
              <Nav />
            </div>
            <div className='mb-3' style={{ height: '50px' }} >
              {alertState.status && <Alert key={alertState.msg} msg={alertState.msg} status={alertState.status} />}
            </div>
          </div>
          <div className='container'>
            <Routes>
              <Route path='/forgot-password' element={<ResetPassword />} />
              {iNoteBookUser ?
                <>
                  <Route path='/' exact element={<UserHome />} />
                  <Route path='/profile' exact element={<ProfilePage />} />
                  <Route path='/*' exact element={<ErrorPage />} />
                </>
                :
                <>
                  <Route path='/' exact element={<HomePage />} />
                  <Route path='/signup' element={<SignUp />} />

                  <Route path='/login' element={<Login />} />
                  <Route path='/*' exact element={<ErrorPage />} />
                </>
              }
              <Route path='/about' element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
