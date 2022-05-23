import numpy as np
import matplotlib.pyplot as plt
import json
import statistics
import scipy.stats as stats
import statsmodels.stats.multicomp as multi

baseline_color = "#1F77B4"
optimering_color = ["#FF7F0E", "#76B041"]
data_optimering_op = ["Heatmap.js", "D3.js"]
active_optimering_index = 0

x_min = 0
x_max = 5000
y_min = 0
y_max = 800

colors = ["#1F77B4", optimering_color[active_optimering_index]]
active_optimering = data_optimering_op[active_optimering_index]


def data_handler():
    heatmapJS_datasets = get_datasets("heatmapJS")
    D3JS_datasets = get_datasets("D3")
    datapoints_am = len(heatmapJS_datasets[0]["loaded"])

    nospikes_heatmapJS_datasets = get_no_spikes_datasets("heatmapJS")
    nospikes_D3JS_datasets = get_no_spikes_datasets("D3")
    #dataasd = filter_data(nospikes_heatmapJS_datasets[0], "render")
    # print(nospikes_heatmapJS_datasets[0][0])

    #print(get_std(filter_nospike_data(nospikes_D3JS_datasets[3], "render")))
    # Both libraries
    library_comparison(heatmapJS_datasets, D3JS_datasets)

    # Heatmap.js
    # plot_bars(heatmapJS_datasets)
    #graph_plot(heatmapJS_datasets, "format", datapoints_am)
    # graph_plot(heatmapJS_datasets, "render",
    # datapoints_am, "Heatmap.js")

    # D3.js
   # graph_plot(D3JS_datasets, "format", datapoints_am)
   # graph_plot(D3JS_datasets, "render",
    #      datapoints_am, "D3.js")

    plot_multiple_bars(heatmapJS_datasets, D3JS_datasets)


def filter_data(data, type):
    result = []
    for dataset in data:
        d = []
        for x in dataset["loaded"]:
            d.append(x[type])
        result.append(d)

    return result


def filter_nospike_data(data, type):
    result = []
    for dataset in data:
        d = []
        for key in dataset:
            if key == type:
                result.append(dataset[key])

    return result


def get_datasets(type):
    date = "03_05_2022"

    f = open(f'./{type}/{type}_DATA_{date}_games-1000.json')
    dataset_1 = json.load(f)

    #f = open(f'./{type}/{type}_DATA_{date}_games-5000.json')
    #dataset_2 = json.load(f)

    f = open(f'./{type}/{type}_DATA_{date}_games-10000.json')
    dataset_3 = json.load(f)

    f = open(f'./{type}/{type}_DATA_{date}_games-50000.json')
    dataset_4 = json.load(f)

    f = open(f'./{type}/{type}_DATA_{date}_games-100000.json')
    dataset_5 = json.load(f)

    datasets = [dataset_1, dataset_3, dataset_4, dataset_5]

    return datasets


def get_no_spikes_datasets(type):
    f = open(f'./{type}/no_spikes/{type}_noSpikes_1000.json')
    dataset_1 = json.load(f)

    f = open(f'./{type}/no_spikes/{type}_noSpikes_10000.json')
    dataset_3 = json.load(f)

    f = open(f'./{type}/no_spikes/{type}_noSpikes_50000.json')
    dataset_4 = json.load(f)

    f = open(f'./{type}/no_spikes/{type}_noSpikes_100000.json')
    dataset_5 = json.load(f)

    datasets = [dataset_1, dataset_3, dataset_4, dataset_5]

    return datasets


def library_comparison(heatmapJS_datasets, D3JS_datasets):
    heatmapJS_render_times = filter_data(heatmapJS_datasets, "render")
    D3JS_render_times = filter_data(D3JS_datasets, "render")

    games_am_arr = [1000, 10000, 50000, 100000]
    datapoints_am = len(heatmapJS_datasets[0]["loaded"])

    i = 0
    for games_am in games_am_arr:
        print("")
        print(f"games: {games_am}")
        anova(heatmapJS_render_times[i], D3JS_render_times[i])
        plot_std(heatmapJS_render_times[i],
                 D3JS_render_times[i], "render", games_am)
        plot_confidence_interval(
            heatmapJS_render_times[i], D3JS_render_times[i], "render", games_am)
        plot_standard_error(
            heatmapJS_render_times[i], D3JS_render_times[i], "render", games_am)
        graph_plot_comparison([heatmapJS_render_times[i], D3JS_render_times[i]],
                              "render", games_am, datapoints_am)
        i += 1


def graph_hist(data):
    data_points = len(data[0]["loaded"])
    am = 50
    maxTime = 0

    for dataset in data:
        d = []

        for x in dataset["loaded"]:
            d.append(x["format"])
            if x["format"] > maxTime:
                maxTime = x["format"]

        plt.hist(d, am, label=f"Games: {dataset['games']}")

    plt.axis([x_min, maxTime, y_min, 80])
    plt.xlabel("Milliseconds")
    plt.ylabel("Frequency")
    plt.legend(loc="upper right")
    plt.title(
        f"All {type} time frequency distribution. Data points ({data_points})")
    plt.show()


def graph_plot(data, type, data_points, library=""):
    maxTime = 0
    plt.figure(figsize=(10, 5))
    for dataset in data:
        d = []

        for x in dataset["loaded"]:
            d.append(x[type])
            if x[type] > maxTime:
                maxTime = x[type]

        plt.plot(d, label=f"Games: {dataset['games']}")

    plt.axis([0, data_points, 0, maxTime])
    plt.xlabel("Rerenders")
    plt.ylabel("Milliseconds")
    plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))
    plt.title(
        f"{library} All {type} time frequency distribution. Data points ({data_points})")
    plt.tight_layout()
    plt.show()


def graph_plot_comparison(data, type, games_am, data_points):
    maxTime = 0
    i = 0
    datasets = ["Heatmap.js", "D3.js"]
    plt.figure(figsize=(10, 5))
    for dataset in data:
        d = []
        for val in dataset:
            d.append(val)
            if val > maxTime:
                maxTime = val

        plt.plot(d, label=datasets[i])
        i += 1

    plt.axis([0, data_points, 0, maxTime])
    plt.xlabel("Rerenders")
    plt.ylabel("Milliseconds")
    plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))
    plt.title(
        f"All {type} time frequency distribution. Games ({games_am}). Data points ({data_points})")
    plt.tight_layout()
    plt.show()


def plot_bars(data):
    maxTime = 0
    gamesAm = []
    loadTimes = []
    colors = ["#2078B4", "#FF881F", "#32A332", "#D83435"]

    for time in data:
        if time["dataLoadTime"] > maxTime:
            maxTime = time["dataLoadTime"]

        loadTimes.append(time["dataLoadTime"])
        gamesAm.append(f'{time["games"]}')

    plt.figure(figsize=(10, 5))
    plt.bar(gamesAm, loadTimes, width=0.7, color=colors)
    plt.xlabel("Amount of games loaded")
    plt.ylabel("Load time in milliseconds")
    plt.title("Data load time in milliseconds")
    plt.show()


def plot_multiple_bars(heatmap, d3):
    maxTime = 0
    gamesAm = []
    loadTimes = []
    colors = ["#2078B4", "#FF881F"]
    n_bars = 2
    bar_width = 0.4
    bars = []
    data = {
        "heatmap": {
            "mean": [],
            "std": [],
            "times": [],
        },
        "d3": {
            "mean": [],
            "std": [],
            "times": [],
        },
    }

    # Get render times for heatmap.js
    for dataset in heatmap:
        render_times = []

        for times in dataset["loaded"]:
            render_times.append(times["render"])

        mean = get_mean(render_times)
        std = get_std(render_times)
        data["heatmap"]["mean"].append(mean)
        data["heatmap"]["std"].append(std)
        data["heatmap"]["times"].append(render_times)

    # Get render times for d3.js
    for dataset in d3:
        render_times = []

        for times in dataset["loaded"]:
            render_times.append(times["render"])

        mean = get_mean(render_times)
        std = get_std(render_times)
        data["d3"]["mean"].append(mean)
        data["d3"]["std"].append(std)
        data["d3"]["times"].append(render_times)

    fig, ax = plt.subplots()
    ind = np.arange(len(data["heatmap"]["mean"]))
    rects1 = ax.bar(ind - bar_width/2, data["heatmap"]["mean"], bar_width, yerr=data["heatmap"]["std"],
                    label='Heatmap.js')
    rects2 = ax.bar(ind + bar_width/2, data["d3"]["mean"], bar_width, yerr=data["d3"]["std"],
                    label='D3.js')

    ax.set_ylabel('Milliseconds')

    ax.set_title('Library render time comparison with standard deviation')
    ax.set_xticks(ind)
    ax.set_xticklabels(('1000', '10 000', '50 000', '100 000'))
    ax.legend()

    plt.show()


def get_mean(data):
    return statistics.mean(data)


def get_std(data):
    return statistics.stdev(data)


def get_confidence_interval(data, confidence=0.95):
    a = 1.0 * np.array(data)
    n = len(a)
    m, se = np.mean(a), stats.sem(a)
    h = se * stats.t.ppf((1 + confidence) / 2., n-1)
    return h
    #return -h, +h


def plot_confidence_interval(data, data2, type, games_am):
    # width of the bars
    barWidth = 0.6

    # Bars Data
    barsData = [get_mean(data), get_mean(data2)]

    # The x-position order of bars
    positions = [0, 1]

    # Std Bars Interval
    barsInterval = [get_confidence_interval(
        data), get_confidence_interval(data2)]

    print(
        f"Confidence interval: Heatmap.js: {get_confidence_interval(data)}, D3.js: {get_confidence_interval(data2)}")

    Opacity = 1
    # Plot bars
    plt.ylim(0, 5)
    plt.bar(positions, barsData, color=colors, edgecolor='black', width=barWidth,
            yerr=barsInterval, capsize=7, alpha=Opacity, lw=1)
    # Put a tick on the x-axis undex each bar and label it with column name
    plt.xticks(positions, ["Heatmap.js", "D3.js"])

    plt.ylabel(f'{type} time in milliseconds')
    # plt.xlabel('Browsers')
    plt.title(f'{type} time confidence interval comparison. Games({games_am})')
    plt.show()


def plot_std(data, data2, type, games_am):
    # width of the bars
    barWidth = 0.6

    # Bars Data
    barsData = [get_mean(data), get_mean(data2)]

    # The x-position order of bars
    positions = [0, 1]

    # Std Bars Interval
    barsInterval = [get_std(data), get_std(data2)]

    print(
        f"std: Heatmap.js: {get_std(data)}, D3.js: {get_std(data2)}")

    Opacity = 1
    # Plot bars
    plt.ylim(0, 5)
    plt.bar(positions, barsData, color=colors, edgecolor='black', width=barWidth,
            yerr=barsInterval, capsize=7, alpha=Opacity)
    # Put a tick on the x-axis undex each bar and label it with column name
    plt.xticks(positions, ["Heatmap.js", "D3.js"])

    plt.ylabel(f'{type} time in milliseconds')
    # plt.xlabel('Browsers')
    plt.title(f'{type} time standard deviation comparison. Games({games_am})')
    plt.show()


def plot_standard_error(data, data2, type, games_am):

    barWidth = 0.6
    barsData = [get_mean(data), get_mean(data2)]
    positions = [0, 1]

    sem_data_1 = np.std(data, ddof=1) / np.sqrt(np.size(data))
    sem_data_2 = np.std(data2, ddof=1) / np.sqrt(np.size(data2))
    barsInterval = [sem_data_1, sem_data_2]
    print(f"Standard error: Heatmap.js: {sem_data_1}, D3.js: {sem_data_2}")

    Opacity = 1
    minValue = 0
    intervalCapsize = 7
    plt.ylim(y_min, 5)
    plt.bar(positions, barsData, color=colors, edgecolor='black', width=barWidth,
            yerr=barsInterval, capsize=7, alpha=Opacity)
    plt.xticks(positions, ["Heatmap.js", "D3.js"])

    plt.ylabel(f'{type} time in milliseconds')
    plt.title(f'{type} time standard error comparison. Games({games_am})')
    plt.show()


def anova(*data):  # * indicates, 0, 1 , 2 .. arguments
    if len(data) == 2:
        statistic, pvalue = stats.f_oneway(data[0], data[1])
    elif len(data) == 3:
        statistic, pvalue = stats.f_oneway(data[0], data[1], data[2])
    elif len(data) == 4:
        statistic, pvalue = stats.f_oneway(data[0], data[1], data[2], data[3])

    #print("pvalue: ", pvalue)
    # print(statistic)
    print("ANOVA Statistic " + str(statistic) + " and p-value " + str(pvalue))

    if pvalue < statistic:
        return True
    else:
        return False


def get_times(data):
    times = []
    for measurement in data:
        times.append(measurement["milliseconds"])

    return times


def get_avg(data):
    sum = 0
    for x in data:
        sum += x

    return sum/len(data)


data_handler()
