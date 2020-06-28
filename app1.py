import dash
import dash_core_components as dcc
import dash_html_components as html
import plotly.express as px
import pandas as pd
import numpy as np
import plotly.graph_objects as go


#external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']

app = dash.Dash(__name__)

fig = go.Figure(data=go.Scatterpolar(r = [4,0,4],theta = [175,0,0],mode = 'lines',line=dict(color='#f44242')))
fig.update_layout(showlegend=False, template='plotly_dark', polar=dict(radialaxis = dict(showticklabels=False, ticks=''), angularaxis = dict(showticklabels=False, ticks='' )),plot_bgcolor='#DCDCDC')





app.layout = html.Div([
    html.Div([
        html.H2('Posture Correction System'),
        html.Img(src='/assets/Logo1.png')
    ], className='banner'),
    html.Div(
        dcc.Graph(id='Real-Time Shoulders',figure=fig,className='figure')
    )
])



if __name__ == '__main__':
    app.run_server(debug=True)
