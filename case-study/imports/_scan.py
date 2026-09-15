from PIL import Image
p=r'C:\Users\rr188\Desktop\test\Fitnplus promotion\case-study\imports\no2.png'
im=Image.open(p).convert('RGBA')
W,H=im.size
print('size',W,H)
crop=im.crop((500,0,1053,1024))
crop=crop.resize((crop.width*2,crop.height*2))
crop.save(r'C:\Users\rr188\Desktop\test\Fitnplus promotion\case-study\imports\_dbg_right.png')
print('saved dbg')
px=im.load()
for y in [150,250,350,450,550,650,750,850]:
    runs=[]
    inrun=None
    for x in range(500,1053):
        r,g,b,a=px[x,y]
        dark = (r<40 and g<40 and b<40)
        if dark and inrun is None:
            inrun=x
        elif not dark and inrun is not None:
            runs.append((inrun,x))
            inrun=None
    if inrun is not None:
        runs.append((inrun,1053))
    print(f'y={y} dark runs: {runs}')
# vertical scan at x columns
for x in [600,650,700,740,780,820,860]:
    runs=[]; inrun=None
    for y in range(0,1024):
        r,g,b,a=px[x,y]
        dark=(r<40 and g<40 and b<40)
        if dark and inrun is None: inrun=y
        elif not dark and inrun is not None:
            runs.append((inrun,y)); inrun=None
    if inrun is not None: runs.append((inrun,1024))
    print(f'x={x} dark runs: {runs}')
