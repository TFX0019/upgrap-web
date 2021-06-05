import { Alert } from "antd"
import { useEffect, useState } from "react"
import { db } from "../firebase/firebase";


const News = () => {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        db.collection('alertas').doc('alerta').get().then(doc => {
            setMessage(doc.data().message)
            setVisible(doc.data().visible);
        }).catch(err => console.log(err))
    })

    return (
       <>
       {visible && <Alert showIcon={false} className="alert_" message={message} banner closable />}
       </>
    )
}

export default News;