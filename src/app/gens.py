from flask_seeder import generator
import os

class ReadLines(generator.Generator):
    
    def __init__(self, fname, encoding='utf-8-sig', **kwargs):
        super().__init__(**kwargs)
        self.gen = self.generator(fname)
        self.encoding = encoding
        
    def generator(self, fname):
        with open(fname, 'r', encoding=self.encoding) as f:
            while line := f.readline():
                yield line.strip()
                
    def generate(self):
        return next(self.gen)

class ReadCSV(generator.Generator):
    
    def __init__(self, fname, encoding='utf-8-sig', sep=',', **kwargs):
        super().__init__(**kwargs)
        self.gen = self.generator(fname)
        self.encoding = encoding
        
        self.sep = sep
        heads = next(self.gen).split(self.sep)
        self.cols = []
        self.ruls = []
        for title in heads:
            col, rul = title.split(':')
            self.cols.append(col)
            self.ruls.append(rul)
        
    def generator(self, fname):
        with open(fname, 'r', encoding=self.encoding) as f:
            while line := f.readline():
                yield line.strip()
                 
    def generate(self):
        line = next(self.gen).split(self.sep)
        data = {}
        for i, v in enumerate(line):
            v = v.strip()
            v = eval(self.ruls[i])(v)
            data[self.cols[i]] = v
        return data
       
