import React, { useContext, useState } from 'react'
import userContext from '../context/user/UserContext'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from './Loader'
import generalContext from '../context/general/generalContext';

const ResetPassword = () => {
    const location = useLocation()
    const { generateOTP, verifyOTP, resetPassword, iNoteBookUser } = useContext(userContext)
    const { theme } = useContext(generalContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState(location.state ? location.state : '')
    const [OTP, setOTP] = useState('')
    //if entered OTP is wrong
    const [wrongOTP, setWrongOTP] = useState(false)
    //show OTP verification modal
    const [showOTP, setShowOTP] = useState(false);

    //show reset password modal
    const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
    //new password
    const [newPassword, setNewPassword] = useState('')
    //confirm new password
    const [newCPassword, setNewCPassword] = useState('')
    const [showHidePassword, setshowHidePassword] = useState('password')
    // check password length 
    const [newPasswordLengthError, setNewPasswordLengthError] = useState(false)
    //check new password and new confirm password is same or note
    const [matchPasswordCPasswordError, setMatchPasswordCPasswordError] = useState(false)


    const [otpVerifyLoading, setOTPVerifyLoading] = useState(false);
    const [generatingOTPLoading, setgeneratingOTPLoading] = useState(false);
    const [resetPasswordLoading, setresetPasswordLoading] = useState(false);

    const handleSubmit = async (event) => {
        setgeneratingOTPLoading(true)
        event.preventDefault()
        const result = await generateOTP(email)
        setgeneratingOTPLoading(false)
        if (result.status === 'success') {
            setShowOTP(true)
        }
    }

    //verify OTP
    const verify = async (event) => {
        setOTPVerifyLoading(true)
        event.preventDefault()
        const result = await verifyOTP(OTP, email)
        if (result.status === 'success') {
            setOTPVerifyLoading(false)
            setShowNewPasswordModal(true)
            setWrongOTP(false)
            setShowOTP(false);
            setOTP('');
        }
        else {
            setOTPVerifyLoading(false)
            setWrongOTP(true)
        }
    }

    const handleNewPasswordLength = () => {
        if (newPassword.length >= 8) {
            setNewPasswordLengthError(false)
        }
        else {
            setNewPasswordLengthError(true)
        }
    }
    const matchNewPassword = () => {
        if (newPassword === newCPassword) {
            setMatchPasswordCPasswordError(false)
        }
        else {
            setMatchPasswordCPasswordError(true)
        }
    }

    //Reset Password
    const SetNewPassword = async (event) => {
        event.preventDefault()
        setresetPasswordLoading(true)
        handleNewPasswordLength()
        matchNewPassword()
        if (newPassword.length >= 8 && newPassword === newCPassword) {
            const result = await resetPassword(email, newPassword)
            if (result.status === 'success') {
                setShowNewPasswordModal(false)
                setWrongOTP(false)
                setOTP('');
                setEmail('')
                setresetPasswordLoading(false)
                iNoteBookUser ? navigate('/profile') : navigate('/login', { state: { email } })
            }
            else {
                setShowNewPasswordModal(true)
                setresetPasswordLoading(false)
            }
        }
    }

    return (
        <>
            {/* Modal for OTP verification*/}
            <Modal
                data-bs-theme={theme}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showOTP}
                onHide={() => {
                    setShowOTP(false);
                    setOTP('');
                    setWrongOTP(false);
                }}
            >
                <Modal.Header closeButton className={` bg-body-tertiary text-${theme === 'dark' ? 'light' : 'dark'}-emphasis`}>
                    <Modal.Title>Verify OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` bg-body-tertiary text-${theme === 'dark' ? 'light' : 'dark'}-emphasis`} >
                    {otpVerifyLoading ?
                        <Loader title='Verifying OTP' color='green' />
                        :
                        <form onSubmit={verify}>
                            <h4 className='text-center' >Enter Your OTP</h4>
                            <div className="mb-3">
                                <label htmlFor="otp" className="form-label">OTP</label>
                                <input name='otp' type="text" className="form-control" style={{ borderColor: wrongOTP ? '#dc3545' : '#ced4da' }} id="otp" value={OTP} onChange={(event) => setOTP(event.target.value)} required />
                                <div style={{ height: '20px', color: '#dc3545' }} >{wrongOTP ? 'Invalid OTP or OTP has been expired please regenerate OTP or try Again ' : ''}</div>
                            </div>
                        </form>
                    }
                </Modal.Body>
                <Modal.Footer className={` bg-body-tertiary text-${theme === 'dark' ? 'light' : 'dark'}-emphasis`}>
                    <Button variant="secondary" onClick={() => { setShowOTP(false); setOTP(''); setWrongOTP(false); }}>
                        cancel
                    </Button>
                    <button type="button" onClick={() => { setShowOTP(false); setOTP(''); setWrongOTP(false); }} className="btn btn-primary">Resend OTP</button>
                    <button type="button" onClick={verify} className="btn btn-primary">Verify</button>
                </Modal.Footer>
            </Modal>

            {/* Modal for set new password*/}
            <Modal
                data-bs-theme={theme}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showNewPasswordModal} onHide={() => { setShowNewPasswordModal(false); }}
            >
                <Modal.Header closeButton className={` bg-body-tertiary text-${theme === 'dark' ? 'light' : 'dark'}-emphasis`}>
                    <Modal.Title>Enter New Password</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` bg-body-tertiary text-${theme === 'dark' ? 'light' : 'dark'}-emphasis`}>
                    {resetPasswordLoading ?
                        <Loader title='Resting Password' color='green' />
                        :
                        <form onSubmit={SetNewPassword}>
                            <label htmlFor="password" className="form-label">Enter Your New Password</label>
                            <input key='newPassword' style={{ borderColor: newPasswordLengthError || matchPasswordCPasswordError ? '#dc3545' : '#ced4da' }} type={showHidePassword} name='password' className="form-control" id="password" onChange={(event) => setNewPassword(event.target.value)} />
                            <div style={{ height: '30px', color: '#dc3545' }} >{newPasswordLengthError ? 'Password length must be at least 8 characters.' : ''}</div>
                            <label htmlFor="cpassword" className="form-label">Confirm Your New Password</label>
                            <input type={showHidePassword} name='cpassword' className="form-control" style={{ borderColor: matchPasswordCPasswordError ? '#dc3545' : '#ced4da' }} id="cpassword" onChange={(event) => setNewCPassword(event.target.value)} />
                            <div style={{ height: '30px', color: '#dc3545' }} >{matchPasswordCPasswordError ? 'Password Not Match' : ''}</div>
                            <div className="form-check">
                                <input onClick={() => showHidePassword === 'password' ? setshowHidePassword('text') : setshowHidePassword('password')} className="form-check-input" type="checkbox" value="" id="showPassword" />
                                <label className="form-check-label" htmlFor="showPassword">
                                    Show Password
                                </label>
                            </div>
                        </form>
                    }
                </Modal.Body>
                <Modal.Footer className={` bg-body-tertiary text-${theme === 'dark' ? 'light' : 'dark'}-emphasis`}>
                    <Button variant="secondary" onClick={() => { setShowNewPasswordModal(false); }}>
                        cancel
                    </Button>
                    <button type="button" onClick={SetNewPassword} className="btn btn-primary">Reset Password</button>
                </Modal.Footer>
            </Modal>


            {/* Email Form */}
            {generatingOTPLoading ?
                <Loader title='Sending OTP' color='green' />
                :
                <>
                    <form onSubmit={handleSubmit}>
                        <h4 className='text-center' >Enter Your Email</h4>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input name='email' type="email" className="form-control" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Send OTP</button>
                    </form>
                    <p className='text-danger mt-2'>OTP is valid for ten Minutes</p>
                </>
            }
        </>
    )
}

export default ResetPassword