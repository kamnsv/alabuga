from flask_mail import Message

def send_email(mail, theme, email, txt):
    msg = Message(theme, recipients=[email])
    msg.html = f'<p>{txt}</p>'
    try:
        mail.send(msg)
    except Exception as e:
        print(e)
        return False
    return True