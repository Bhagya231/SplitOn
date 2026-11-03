package com.example.demo.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AppLogger
{
    private AppLogger()
    {}

    public static Logger getLogger(Class<?> cla)
    {
        return LoggerFactory.getLogger(cla);
    }

}
