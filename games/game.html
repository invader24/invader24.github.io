#include <iostream>
#include <time.h>
#include <stdlib.h>
#include <conio.h>
#include <time.h>
#include <ctype.h>
#include <time.h>
#include <windows.h>
#include <process.h>
using namespace std;

char board[36];
int pos = 18;
int obs = 0;

void print()                //function to print the board
{
    board[obs]='0';
    board[pos] = '^';
    for(int i = 1; i<36; i++)
    {
        printf("| %c ", board[i]);
        //printf("| %d ", i);
        if(i%5 == 0)
        {
            printf("|\n");
        }
    }
}

void set()
{
    for(int i = 1; i<36; i++)
    {
        board[i]=32;
    }
}

int movement()
{
    char move;
    move = getch();
    switch(move)
        {
            case('w'):
            {
                if(pos > 5)
                {
                    board[pos] = 32;
                    pos -= 5;
                }
                break;
            }
            case('a'):
            {
                if(pos%5 != 1)
                {
                    board[pos] = 32;
                    pos--;
                }
                break;
            }
            case('s'):
            {
                board[pos] = 32;
                if(pos <31)
                {
                    pos += 5;
                }
                break;
            }
            case('d'):
            {
                board[pos] = 32;
                if(pos%5 > 0)
                {
                    pos++;
                }
                break;
            }
        }
        if(board[pos] == '0')
        {
            return -1;
        }
        return 0;
}

int random()
{
    return(rand()%5+1);
}

void set_obstacles()
{
    obs = random();
    board[obs]='0';
}

int obstacle_movement()
{
    board[pos] = 32;
    for(int i = 35; i>5; i--)
    {
        if(board[pos] == '0')
        {
            return -1;
        }
        board[i] = board[i-5];
    }
    for(int i = 1; i<6; i++)
    {
        board[i] = 32;
    }
    set_obstacles();
    return 0;
}

int rungame()
{
    double time_spent1 = 0.0;
    double time_check1 = 0.1;
    srand(time(0));
    set();
    cout<<"Press any key to start the game!\n";
    getch();
    system("cls");
    clock_t begin1 = clock();
    int play = 20;
    while(play != -1)
    {
        while(!kbhit())
        {
            system("cls");
            print();
            clock_t check1 = clock();
            time_check1 += (long)(check1 - begin1) / CLOCKS_PER_SEC;
            unsigned long temp = (500-(time_check1)/10);
            _sleep(temp);
            play = obstacle_movement();
            if(play == -1)
            {
                break;
            }
        }
        if(play == -1)
        {
            clock_t end1 = clock();
            time_spent1 += (double)(end1 -begin1) / CLOCKS_PER_SEC;
            break;
        }
        play = movement();
        if(play == -1)
        {
            clock_t end1 = clock();
            time_spent1 += (double)(end1 -begin1) / CLOCKS_PER_SEC;
            break;
        }
    }
    printf("Your score is %f seconds\n", time_spent1);
}

int main()
{
    boolean playing = true;
    char check;
    while(playing == true)
    {
        rungame();
        
        cout<<"Press X to exit\n";
        check = getch();
        if(check == 'x')
        {
            playing = false;
        } 
    }
    
    return 0;
}
