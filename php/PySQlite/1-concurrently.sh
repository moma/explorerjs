#!/bin/bash

rm -R *~ *.pyc
nohup python main.py $1 10 &
nohup python main.py $1 20 &
nohup python main.py $1 30 &
nohup python main.py $1 40 &
nohup python main.py $1 50 &
nohup python main.py $1 60 &
nohup python main.py $1 70 &
nohup python main.py $1 80 &
nohup python main.py $1 90 &
nohup python main.py $1 100 &
