from app import app
import flask.ext.whooshalchemy as whooshalchemy

class Post(db.Model):
    __searchable__ = ['body']

    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post %r>' % (self.body)

whooshalchemy.whoosh_index(app, Post)
