from setuptools import setup, find_packages


setup(
    name='feature-tests',
    version='1.0',
    packages=find_packages(exclude=('tests',)),
    install_requires=[line.strip() for line in open('requirements.txt') if len(line) > 0]
)
