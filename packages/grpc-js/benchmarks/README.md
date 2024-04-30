This folder contains basic benchmarks to approximate performance impact of changes


## How to test

1. pnpm build; pnpm ts-node --transpile-only ./benchmarks/server.ts
2. pnpm tsc -p tsconfig.modern.json; pnpm ts-node --transpile-only ./benchmarks/server.ts
3. ideally run with jemalloc or memory fragmentation makes everything run slower over time

For mac os:
`DYLD_INSERT_LIBRARIES=$(brew --prefix jemalloc)/lib/libjemalloc.dylib pnpm ts-node --transpile-only ./benchmarks/server.ts`

`DYLD_INSERT_LIBRARIES=$(brew --prefix jemalloc)/lib/libjemalloc.dylib NODE_ENV=production clinic flame -- node -r ts-node/register/transpile-only ./benchmarks/server.ts`

`DYLD_INSERT_LIBRARIES=$(brew --prefix jemalloc)/lib/libjemalloc.dylib NODE_ENV=production node -r ts-node/register/transpile-only --trace-opt --trace-deopt ./benchmarks/server.ts`

2. h2load -n200000 -m 50 http://localhost:9999/EchoService/Echo -c10 -t 10 -H 'content-type: application/grpc' -d ./echo-unary.bin

Baseline on M1 Max Laptop:

```
ES2017 & ESNext targets are within margin of error:

finished in 4.09s, 48851.86 req/s, 2.47MB/s
requests: 200000 total, 200000 started, 200000 done, 200000 succeeded, 0 failed, 0 errored, 0 timeout
status codes: 200000 2xx, 0 3xx, 0 4xx, 0 5xx
traffic: 10.11MB (10603710) total, 978.38KB (1001860) headers (space savings 96.40%), 3.62MB (3800000) data
                     min         max         mean         sd        +/- sd
time for request:     2.47ms    104.19ms     10.18ms      3.46ms    94.40%
time for connect:      790us      1.13ms       879us        98us    90.00%
time to 1st byte:    12.09ms     97.17ms     52.68ms     28.04ms    60.00%
req/s           :    4885.61     4922.01     4901.67       14.07    50.00%


```

---

Changes to stream decoder:

1. switch -> if

```
h2load -n200000 -m 50 http://localhost:9999/EchoService/Echo -c10 -t 10 -H 'content-type: application/grpc' -d ./echo-unary.bin

finished in 3.82s, 52410.67 req/s, 2.65MB/s
requests: 200000 total, 200000 started, 200000 done, 200000 succeeded, 0 failed, 0 errored, 0 timeout
status codes: 200000 2xx, 0 3xx, 0 4xx, 0 5xx
traffic: 10.11MB (10603690) total, 978.36KB (1001840) headers (space savings 96.40%), 3.62MB (3800000) data
                     min         max         mean         sd        +/- sd
time for request:     1.87ms     47.64ms      9.49ms      1.89ms    97.25%
time for connect:     1.75ms      3.14ms      2.43ms       410us    70.00%
time to 1st byte:     6.58ms     45.08ms     23.01ms     13.70ms    60.00%
req/s           :    5242.32     5270.74     5253.00        9.37    70.00%
```

2. const enum is comparable to enum

3. fewer buffer.concat,f unsafeAlloc


```
finished in 3.40s, 58763.66 req/s, 987.33KB/s
requests: 200000 total, 200000 started, 200000 done, 200000 succeeded, 0 failed, 0 errored, 0 timeout
status codes: 200000 2xx, 0 3xx, 0 4xx, 0 5xx
traffic: 3.28MB (3441011) total, 1.01MB (1063183) headers (space savings 97.04%), 176.74KB (180986) data
                     min         max         mean         sd        +/- sd
time for request:      304us     41.57ms      3.28ms      1.63ms    80.98%
time for connect:      831us      1.47ms      1.14ms       181us    70.00%
time to 1st byte:     2.64ms     25.10ms     11.42ms      7.87ms    60.00%
req/s           :    5877.32     6303.71     6082.75      168.23    50.00%
```


```
old decoder:

finished in 3.83s, 52210.19 req/s, 2.64MB/s
requests: 200000 total, 200000 started, 200000 done, 200000 succeeded, 0 failed, 0 errored, 0 timeout
status codes: 200000 2xx, 0 3xx, 0 4xx, 0 5xx
traffic: 10.11MB (10603670) total, 978.34KB (1001820) headers (space savings 96.40%), 3.62MB (3800000) data
                     min         max         mean         sd        +/- sd
time for request:     1.16ms     18.75ms      3.82ms      1.45ms    88.89%
time for connect:      723us      1.38ms      1.18ms       191us    80.00%
time to 1st byte:     3.45ms     17.72ms      9.00ms      4.95ms    70.00%
req/s           :    5221.65     5235.13     5225.05        4.23    90.00%
```

