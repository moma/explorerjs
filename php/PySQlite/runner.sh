#!/bin/bash

rm -R *~ *.pyc
nohup python main.py $1 100 &
nohup python main.py $1 200 &
nohup python main.py $1 300 &
nohup python main.py $1 400 &
nohup python main.py $1 500 &
nohup python main.py $1 600 &
