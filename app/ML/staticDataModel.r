rm(list = ls(.GlobalEnv), envir = .GlobalEnv)
setwd("~/LeagueOfDraft/app/ML/data")

library(randomForest)
library(caret)
library(doMC)
library(e1071)
library(AppliedPredictiveModeling)
transparentTheme(trans = .4)

registerDoMC(cores = 4)


load_data <- function(path) { 
  files <- dir(path, pattern = '\\.csv', full.names = TRUE)
  tables <- lapply(files, read.csv)
  do.call(rbind, tables)
}
matches <- load_data("csv")[,-c(1:9)]

#remove trolls
matches <- na.omit(matches)

#make character instead of numeric
matches$purple_mid <- as.character(matches$purple_mid)
matches$purple_top <- as.character(matches$purple_top)
matches$purple_jng <- as.character(matches$purple_jng)
matches$purple_adc <- as.character(matches$purple_adc)
matches$purple_supp <- as.character(matches$purple_supp)
matches$blue_mid <- as.character(matches$blue_mid)
matches$blue_top <- as.character(matches$blue_top)
matches$blue_jng <- as.character(matches$blue_jng)
matches$blue_adc <- as.character(matches$blue_adc)
matches$blue_supp <- as.character(matches$blue_supp)

tfModel <- tuneRF(matches[, -ncol(matches)], matches$winner, ntreeTry=400, stepFactor=2, improve=0.01,
       trace=TRUE, plot=TRUE, doBest=TRUE)

svmModel <- tuneSVM(winner~., data = matches)
