import datetime
from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
auth = HTTPBasicAuth()

users = {'secret': generate_password_hash('secret')}


@auth.verify_password
def verify_password(username, password):
    if username in users:
        return check_password_hash(users.get(username), password)
    return False


@app.route('/')
@auth.login_required
def root():
    return render_template('index.html')


@socketio.on('json')
def handle_json(json):
    room = json['room']
    send(json, json=True, room=room)


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send({
        'message': username + ' has entered the room.',
        'timestamp': datetime.datetime.now().isoformat(),
        'username': None,
        'type': 'info'
    }, room=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send({
        'message': username + ' has left the room.',
        'timestamp': datetime.datetime.now().isoformat(),
        'username': None,
        'type': 'info'
    }, room=room)


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
