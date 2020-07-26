from flask import Flask, render_template
from flask_assets import Bundle, Environment

app = Flask(__name__)

js = Bundle("js/jquery-2.2.4.min.js", "js/popper.js", "js/bootstrap.min.js", "js/jquery.ajaxchimp.min.js", "js/waypoints.min.js", "js/mail-script.js", "js/contact.js", "js/jquery.form.js", "js/jquery.validate.min.js", "js/mail-script.js", "js/theme.js", output="gen/main.js")

assets = Environment(app)

assets.register("main_js", js)

@app.route("/index")
@app.route("/")
def index():
        return render_template("index.html")
        
@app.route("/dashboard")
def dashboard():
        return render_template("Dashboard.html")

@app.route("/contact")
def contact():
        return render_template("contact.html") 

@app.route("/posenet")
def posenet():
        return render_template("posenet.html")  
        
if __name__ == "__main__":
        app.run(debug = True)     
